import { notification } from 'antd';
import io from 'socket.io-client';
import _ from 'lodash';
import axios from 'axios';

import DeviceSelection from '../components/deviceSelection';
import Map from '../components/map';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: []
    };
  }

  componentDidMount() {
    this.getDeviceList();
    this.subscribeToUdpates();
  }

  subscribeToUdpates() {
    this.socket = io(process.env.SERVER_URL);

    this.socket.on('location', location => {
      console.log(location);
      notification.success({
        message: `Received new location update`,
        description: `Device: ${location.device_id}`
      });

      let devices = this.state.devices;
      devices[location.device_id] = {
        location
      };

      this.setState({
        devices
      });
    });

    this.socket.on('activity', activity => {
      console.log(activity);
      this.setState({
        activity
      });
    });

    this.socket.on('health', health => {
      console.log(health);
      this.setState({
        health
      });
    });

    this.socket.on('summary', summary => {
      console.log(summary);
      this.setState({
        summary
      });
    });

    this.socket.on('trip', trip => {
      console.log(summary);
      this.setState({
        trip
      });
    });
  }

  getDeviceList() {
    // get all devices from HyperTrack
    const options = {
      method: 'get',
      url: `${process.env.SERVER_URL}/devices`
    };

    axios(options)
      .then(resp => {
        let devices = resp.data;

        // update device_status
        for (let i = 0; i < devices.length; i++) {
          const device = devices[i];

          if (device.device_status === 'active') {
            device.device_status = device.activity.data.value;
          }
        }

        this.setState({
          devices
        }, () => {
          // get last summaries
          this.getSummaries();
        });
      });
  }

  getSummaries() {
    // get last summaries for all devices from HyperTrack
    this.state.devices.forEach((device, i) => {
      const options = {
        method: 'get',
        url: `${process.env.SERVER_URL}/summaries/${device['device_id']}`
      };

      axios(options)
        .then(resp => {
          let {devices} = this.state;
          devices[i].summaries = resp.data;

          this.setState({
            devices
          });
        });
    });
  }

  render() {
    return (
      <div>
        <Map devices={this.state.devices} />
        <DeviceSelection devices={this.state.devices} />
      </div>
    );
  }
}

export default Index;