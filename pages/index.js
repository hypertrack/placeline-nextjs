import { Layout } from "antd";
import _ from "lodash";
import axios from "axios";

import DeviceSelection from "../components/deviceSelection";
import Map from "../components/map";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      filterText: "",
      filteredDevices: [],
      placesPerDevice: {},
      trips: {},
      tripsPerDevice: {},
      filteredTrips: [],
      devicesLoading: true,
      placesLoading: true,
      tripsLoading: true
    };
  }

  componentDidMount() {
    this.getDeviceList();
  }

  onDeviceSelect() {
    this.setState({
      devicesLoading: true
    });
  }

  filterDevices(filterText) {
    this.setState({
      filterText,
      filteredDevices: this.state.devices.filter(device => {
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

  getDeviceList() {
    let devices = [];

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
        devices.push(resp.data[i]);
      }

      this.setState({
        devices,
        devicesLoading: false
      });

      // with known devices, get places
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
      let placesPerDevice = {};
      for (let i = 0; i < resp.data.length; i++) {
        let place = resp.data[i];

        placesPerDevice[place.device_id] =
          placesPerDevice[place.device_id] || {};

        placesPerDevice[place.device_id][place.label] = place;
      }

      this.setState({
        placesPerDevice,
        placesLoading: false
      });

      // with places and devices, get trips
      this.getTrips();
    });
  }

  getTrips() {
    let trips = {};
    let tripsPerDevice = {};

    // get all trips created by the sample app
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/trips`
    };

    axios(options).then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        let trip = resp.data[i];

        const { trip_id, device_id, status } = trip;

        // store in object
        trips[trip_id] = trip;

        // count completed and active trips
        tripsPerDevice[device_id] = {
          active:
            _.get(tripsPerDevice, `[${device_id}].active`, 0) +
            (status === "active" ? 1 : 0),
          completed:
            _.get(tripsPerDevice, `[${device_id}].completed`, 0) +
            (status === "completed" ? 1 : 0)
        };
      }

      this.setState({
        trips,
        tripsPerDevice,
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
            placesPerDevice={this.state.placesPerDevice}
            tripsPerDevice={this.state.tripsPerDevice}
            devicesLoading={this.state.devicesLoading}
            placesLoading={this.state.placesLoading}
            tripsLoading={this.state.tripsLoading}
            onSelect={() => this.onDeviceSelect()}
            filterText={this.state.filterText}
            filteredDevices={this.state.filteredDevices}
            filterDevices={e => this.filterDevices(e)}
          />
        </Sider>
        <Map
          loading={this.state.devicesLoading}
          devices={
            this.state.filterText === ""
              ? this.state.devices
              : this.state.filteredDevices
          }
        />
        t
      </Layout>
    );
  }
}

export default Index;
