import { notification, Layout } from "antd";
import io from "socket.io-client";
import _ from "lodash";
import axios from "axios";

import DeviceSelection from "../components/deviceSelection";
import Map from "../components/map";

import { findDeviceById } from "../common/devices";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      places: [],
      loading: true,
      devicesLoading: true
    };
  }

  componentDidMount() {
    this.getDeviceList();
    this.getDevicePlaces();
    this.subscribeToUdpates();
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
        data: {
          speed: location.data.speed,
          altitude: location.data.altitude,
          location_accuracy: location.data.location_accuracy,
          bearing: location.data.bearing,
          location: location.data.location
        },
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
        value: deviceStatus.data.value
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
          // TODO: This is a known bug
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
          width="25%"
          style={{ minHeight: "100vh" }}
        >
          <DeviceSelection
            devices={this.state.devices}
            places={this.state.places}
            loading={this.state.loading}
            devicesLoading={this.state.devicesLoading}
            onSelect={() => this.onDeviceSelect()}
          />
        </Sider>
        <Map loading={this.state.loading} devices={this.state.devices} />t
      </Layout>
    );
  }
}

export default Index;
