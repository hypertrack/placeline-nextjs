import { Layout } from "antd";
import io from "socket.io-client";
import _ from "lodash";
import axios from "axios";

import DeviceSelection from "../components/deviceSelection";
import Map from "../components/map";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: {},
      filterText: "",
      filteredDevices: [],
      places: [],
      trips: {},
      filteredTrips: [],
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

  filterDevices(filterText) {
    this.setState({
      filterText,
      filteredDevices: _.toArray(this.state.devices).filter(device => {
        return (
          _.defaultTo(_.get(device, "device_info.name"), "")
            .toLowerCase()
            .includes(filterText.toLowerCase()) ||
          _.defaultTo(_.get(device, "device_id"), "")
            .toLowerCase()
            .includes(filterText.toLowerCase())
        );
      })
    });
  }

  updateDeviceLocation(id, location) {
    let { devices } = this.state;

    // update device without new Devices API call
    devices[id] = {
      ...devices[id],
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

  updateDeviceStatus(id, deviceStatus) {
    let { devices } = this.state;

    // update device without new Devices API call
    devices[id] = {
      ...devices[id],
      device_status: {
        data: {
          recorded_at: deviceStatus.recorded_at,
          activity: deviceStatus.data.activity,
          reason: deviceStatus.data.reason
        },
        value:
          deviceStatus.data.value === "active"
            ? _.get(deviceStatus, "data.activity", "unknown")
            : deviceStatus.data.value
      }
    };

    this.setState({
      devices
    });
  }

  updateTripStatus(id, tripUpdate) {
    let tripsState = this.state.trips;

    if (_.get(tripsState, `[${id}]`, false)) {
      // update trips without new Trips API call
      tripsState[id] = {
        ...tripsState[id],
        status:
          tripUpdate.data.value === "completed"
            ? "completed"
            : tripsState[id].status,
        summary:
          tripUpdate.data.value === "completed"
            ? tripUpdate.data.summary
            : tripsState[id].summary,
        estimate: {
          arrive_at:
            tripUpdate.data.value === "delayed"
              ? tripUpdate.data.arrive_at
              : tripsState[id].estimate.arrive_at
        }
      };

      // likely going to change: only handle active trips
      this.setState({
        trips: tripsState
      });
    }
  }

  subscribeToUdpates() {
    this.socket = io(process.env.SERVER_URL);

    this.socket.on("location", location => {
      this.updateDeviceLocation(location.device_id, location);
    });

    this.socket.on("device_status", deviceStatus => {
      this.updateDeviceStatus(deviceStatus.device_id, deviceStatus);
    });

    this.socket.on("trip", tripUpdate => {
      this.updateTripStatus(tripUpdate.data.trip_id, tripUpdate);
    });
  }

  getDeviceList() {
    let devices = {};

    // get all devices
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/devices`
    };

    axios(options).then(resp => {
      // update device_status
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].device_status.value === "active") {
          // This is a known bug
          resp.data[i].device_status.value = _.get(
            resp.data[i].device_status,
            "data.activity",
            "unknown"
          );
        }

        // store in object
        devices[resp.data[i].device_id] = resp.data[i];
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
    let trips = {};

    // get all trips created by the sample app
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/trips`
    };

    axios(options).then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        // store in object
        trips[resp.data[i].trip_id] = resp.data[i];
      }

      this.setState({
        trips,
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
            devices={_.toArray(this.state.devices)}
            places={this.state.places}
            loading={this.state.loading}
            trips={_.toArray(this.state.trips)}
            devicesLoading={this.state.devicesLoading}
            tripsLoading={this.state.tripsLoading}
            onSelect={() => this.onDeviceSelect()}
            filterText={this.state.filterText}
            filteredDevices={this.state.filteredDevices}
            filterDevices={e => this.filterDevices(e)}
          />
        </Sider>
        <Map
          loading={this.state.loading}
          devices={
            this.state.filterText === ""
              ? this.state.devices
              : this.state.filteredDevices
          }
          // only show active trips of filtered devices on map
          trips={_.toArray(this.state.trips)}
        />
        t
      </Layout>
    );
  }
}

export default Index;
