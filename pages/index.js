import { notification, Layout } from "antd";
import io from "socket.io-client";
import _ from "lodash";
import axios from "axios";

import DeviceSelection from "../components/deviceSelection";
import Map from "../components/map";

import { findDeviceById } from "../common/devices";
import { findTripById } from "../common/trips";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      places: [],
      trips: [],
      loading: true,
      devicesLoading: true,
      tripsLoading: true
    };
  }

  componentDidMount() {
    this.getDeviceList();
  }

  onDeviceSelect() {
    this.setState({
      loading: true
    });
  }

  updateDeviceLocation(i, location) {
    let devices = this.state.devices;

    // update device without new Devices API call
    devices[i] = {
      ...devices[i],
      location: {
        speed: location.data.speed,
        accuracy: location.data.accuracy,
        bearing: location.data.bearing,
        geometry: location.data.location,
        recorded_at: location.recorded_at
      }
    };

    this.setState({
      devices
    });
  }

  updateDeviceStatus(i, deviceStatus) {
    let devices = this.state.devices;

    // update device without new Devices API call
    devices[i] = {
      ...devices[i],
      device_status: {
        data: {
          recorded_at: deviceStatus.recorded_at,
          activity: deviceStatus.data.activity,
          reason: deviceStatus.data.reason
        },
        value:
          deviceStatus.data.value === "active"
            ? _.get(deviceStatus, "data.activity", "unknown_activity")
            : deviceStatus.data.value
      }
    };

    this.setState({
      devices
    });
  }

  updateDeviceBattery(i, battery) {
    let devices = this.state.devices;

    // update device without new Devices API call
    devices[i] = {
      ...devices[i],
      battery: battery.data.value
    };

    this.setState({
      devices
    });
  }

  updateTripStatus(i, tripUpdate) {
    let tripsState = this.state.trips;

    if (_.get(tripsState, "[i]", false)) {
      // update trips without new Trips API call
      tripsState[i] = {
        ...tripsState[i],
        status:
          tripUpdate.data.value === "completed"
            ? "completed"
            : tripsState[i].status,
        summary:
          tripUpdate.data.value === "completed"
            ? tripUpdate.data.summary
            : tripsState[i].summary,
        estimate: {
          arrive_at:
            tripUpdate.data.value === "delayed"
              ? tripUpdate.data.arrive_at
              : tripsState[i].estimate.arrive_at
        }
      };

      // likely going to change: only manage active trips
      this.setState({
        trips: tripsState.filter(trip => trip.status === "active")
      });
    }
  }

  showNotification(text, device) {
    const deviceName = device
      ? _.get(device, "device_info.name", "")
      : "unnamed device";

    notification.success({
      message: `${text} for ${deviceName}`,
      duration: 2,
      placement: "bottomRight"
    });
  }

  subscribeToUdpates() {
    this.socket = io(process.env.SERVER_URL);

    this.socket.on("location", location => {
      const { device, i } = findDeviceById(
        this.state.devices,
        location.device_id
      );

      this.showNotification("Updated location", device);
      this.updateDeviceLocation(i, location);
    });

    this.socket.on("device_status", deviceStatus => {
      const { device, i } = findDeviceById(
        this.state.devices,
        deviceStatus.device_id
      );

      this.showNotification("Updated device status", device);
      this.updateDeviceStatus(i, deviceStatus);
    });

    this.socket.on("battery", battery => {
      const { device, i } = findDeviceById(
        this.state.devices,
        battery.device_id
      );

      this.showNotification("Updated battery status", device);
      this.updateDeviceBattery(i, battery);
    });

    this.socket.on("trip", tripUpdate => {
      const { i } = findTripById(this.state.trips, tripUpdate.data.trip_id);
      const { device } = findDeviceById(
        this.state.devices,
        tripUpdate.device_id
      );

      this.showNotification("Updated trip status", device);
      this.updateTripStatus(i, tripUpdate);
    });
  }

  getDeviceList() {
    // get all devices
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/devices`
    };

    axios(options).then(resp => {
      let devices = resp.data;

      // update device_status
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];

        if (device.device_status.value === "active") {
          // This is a known bug
          device.device_status.value = _.get(
            device.device_status,
            "data.activity",
            "unknown_activity"
          );
        }
      }

      this.setState({
        devices,
        loading: false
      });

      // with known devices, subscribe to updates and get places
      this.subscribeToUdpates();
      this.getDevicePlaces();
    });
  }

  getDevicePlaces() {
    // get all device places
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/device-places`
    };

    axios(options).then(resp => {
      this.setState({
        places: resp.data,
        devicesLoading: false
      });

      // with places and devices, get trips
      this.getTrips();
    });
  }

  getTrips() {
    // get all trips created by the sample app
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/trips`,
      params: {
        status: "active"
      }
    };

    axios(options).then(resp => {
      this.setState({
        trips: resp.data,
        tripsLoading: false
      });
    });
  }

  render() {
    const { Sider } = Layout;

    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          theme="light"
          width="30%"
          style={{ minHeight: "100vh" }}
        >
          <DeviceSelection
            devices={this.state.devices}
            places={this.state.places}
            loading={this.state.loading}
            trips={this.state.trips}
            devicesLoading={this.state.devicesLoading}
            tripsLoading={this.state.tripsLoading}
            onSelect={() => this.onDeviceSelect()}
          />
        </Sider>
        <Map
          loading={this.state.loading}
          devices={this.state.devices}
          trips={this.state.trips}
        />
        t
      </Layout>
    );
  }
}

export default Index;
