import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { notification, Modal, Button, Statistic, Row, Col, Timeline } from 'antd';
import io from 'socket.io-client';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import DeviceList from '../components/deviceList';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      summary: false
    };

    // This binding is necessary to make `this` work in the callback
    this.onSummary = this.onSummary.bind(this);
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
        description: `Device ID: ${location.device_id}`
      });

      let devices = this.state.devices;
      devices[location.device_id] = {
        location
      };

      this.setState({ devices });
    });

    this.socket.on('activity', activity => {
      console.log(activity);
      this.setState({ activity });
    });

    this.socket.on('health', health => {
      console.log(health);
      this.setState({ health });
    });

    this.socket.on('summary', summary => {
      console.log(summary);
      this.setState({ summary });
    });

    this.socket.on('trip', trip => {
      console.log(summary);
      this.setState({ trip });
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

          if(device.device_status === 'active') {
            device.device_status = device.activity.data.value;
          }
        }

        this.setState({ devices });
      });
  }

  onSummary(id) {
    this.setState({ summary: id });
  }

  render() {
    const MyMapComponent = withScriptjs(withGoogleMap((props) => {
      const markerItems = props.devices.map((device) =>
      <MarkerWithLabel
        key={`label-${device.device_id}`}
        position={{ lat: _.get(device,'location.data.location.coordinates[1]'), lng: _.get(device,'location.data.location.coordinates[0]')}}
        labelAnchor={new google.maps.Point(100, -15)}>
        <div>{device.device_id}</div>
      </MarkerWithLabel>
      );

      return (<GoogleMap
        defaultZoom={12}
        defaultCenter={ {lat: 37.7933412, lng: -122.3995876} } >
        {markerItems}
      </GoogleMap>);
    }
    ));

    const summary = _.get(this.state, `devices[${this.state.summary}].summary`);

    const timelineStyle = {
      margin: '50px 0'
    };

    const summarySegments = [];

    return (
      <div>
            <MyMapComponent
                devices={this.state.devices}
                googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyD6V1v4K6l_nm-W9KdCLMObqDgU0znIt-w&v=3.exp&libraries=geometry,drawing,places'
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
            <DeviceList devices={this.state.devices} onSummary={this.onSummary} />
            <Modal
              title="Most recent summary"
              footer={[
                <Button key="submit" type="primary" onClick={e => {
                  this.setState({ summary: false });
                }}>
                  OK
                </Button>,
              ]}
              visible={this.state.summary !== false} >
                <Row gutter={8} type="flex" justify="space-around" align="middle">
                  <Col span={8}>
                    <Statistic title="Duration" value={moment.duration(_.get(summary, 'data.duration', 0), 's').humanize()} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Distance" value={_.get(summary, 'data.distance', 0)} suffix="km" />
                  </Col>
                </Row>
                <Row gutter={8} type="flex" justify="space-around" align="middle">
                  <Col span={16} style={timelineStyle}>
                    <Timeline>
                      <Timeline.Item color="green">{`Started on ${moment(_.get(summary, 'data.start_datetime', '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                      <Timeline.Item>To do: Segments in between</Timeline.Item>
                      <Timeline.Item color="red">{`Ended on ${moment(_.get(summary, 'data.end_datetime', '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                    </Timeline>
                  </Col>
                </Row>
            </Modal>
        </div>
    );
  }
}

export default Index;