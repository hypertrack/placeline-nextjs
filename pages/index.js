import { notification, Skeleton, Layout } from "antd";
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
      loading: true
    };
  }

  componentDidMount() {
    this.getDeviceList();
    this.subscribeToUdpates();
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

  updateDeviceActivity(i, activity) {
    let devices = this.state.devices;

    // update device without new Devices API call
    // includes device status update
    devices[i] = {
      ...devices[i],
      device_status:
        devices[i].device_status === "active"
          ? activity.data.value
          : devices[i].device_status,
      activity: {
        data: {
          value: activity.data.value,
          location: activity.data.location
        },
        recorded_at: activity.recorded_at
      }
    };

    this.setState({
      devices
    });
  }

  updateDeviceHealth(i, health) {
    let devices = this.state.devices;

    // update device without new Devices API call
    devices[i] = {
      ...devices[i],
      device_health: {
        data: {
          value: health.data.value,
          hint: health.data.hint
        },
        recorded_at: health.recorded_at
      },
      device_status: health.data.value.includes("outage")
        ? "disconnected"
        : "active"
    };

    this.setState({
      devices
    });
  }

  showNotification(text, device) {
    const deviceName = device
      ? _.get(device, "device_info.name", "")
      : "unknown device";

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

    this.socket.on("activity", activity => {
      const { device, i } = findDeviceById(
        this.state.devices,
        activity.device_id
      );

      this.showNotification("Updated activity", device);
      this.updateDeviceActivity(i, activity);
    });

    this.socket.on("health", health => {
      const { device, i } = findDeviceById(
        this.state.devices,
        health.device_id
      );

      this.showNotification("Updated health", device);
      this.updateDeviceHealth(i, health);
    });
  }

  getDeviceList() {
    // get all devices from HyperTrack
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/devices`
    };

    axios(options).then(resp => {
      let devices = resp.data;

      // update device_status
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];

        if (device.device_status === "active") {
          device.device_status = device.activity.data.value;
        }
      }

      this.setState({
        devices,
        loading: false
      });
    });
  }

  render() {
    const { Header } = Layout;

    return (
      <Layout>
        <Header>
          <DeviceSelection
            devices={this.state.devices}
            loading={this.state.loading}
          />
          <Skeleton active loading={this.state.loading} />
        </Header>
        {!this.state.loading && <Map devices={this.state.devices} />}
      </Layout>
    );
  }
}

export default Index;
