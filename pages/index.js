import { notification, Modal, Button, Statistic, Row, Col, Timeline } from 'antd';
import io from 'socket.io-client';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import DeviceList from '../components/deviceList';
import Map from '../components/map';

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
        description: `Device: ${location.device_id}`
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
    const summary = _.get(this.state, `devices[${this.state.summary}].summary`);

    const timelineStyle = {
      margin: '50px 0 0 0'
    };

    const segments = _.get(summary, 'data.segments', []);
    const summarySegments = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      summarySegments.push(<Timeline.Item key={`segment-${i}`}>{`${segment.type} activity for ${moment.duration(segment.duration, 's').humanize()} (${segment.distance} km)`}</Timeline.Item>);
    }

    return (
      <div>
            <Map devices={this.state.devices} />
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
                      {summarySegments}
                      <Timeline.Item color="red">{`Ended on ${moment(_.get(summary, 'data.end_datetime', '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                    </Timeline>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Map segments={segments} />
                  </Col>
                </Row>
            </Modal>
        </div>
    );
  }
}

export default Index;