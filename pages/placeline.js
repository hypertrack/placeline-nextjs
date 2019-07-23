import { Layout, Statistic, Row, Col, Timeline, PageHeader, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import Router from 'next/router';

import Map from '../components/map';

class Placeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summaries: [],
      currentSummary: 0,
      loading: true
    };
  }

  static getInitialProps({query}) {
    return {query};
  }

  componentDidMount() {
    this.getSummaries();
  }

  onDateChange(date, dateString) {
    console.log(date, dateString);
  }

  getSummaries() {
    // get last summaries for selected device
      const options = {
        method: 'get',
        url: `${process.env.SERVER_URL}/summaries/${this.props.query.id}`
      };

      axios(options)
        .then(resp => {
          this.setState({
            summaries: resp.data,
            currentSummary: 0,
            loading: false
          });
        });
  }

  renderSegments(segments) {
    return segments.map((segment, i) => {
      <Timeline.Item key={`segment-${i}`}>{`${segment.type} activity for ${moment.duration(segment.duration, 's').humanize()} (${segment.distance} km)`}</Timeline.Item>
    });
  }

  render() {
    if(!this.state.summaries || this.state.loading) {
      return (<div>Loading ...</div>);
    }

    const timelineStyle = {
      margin: '50px 0 0 0'
    };

    const { Header, Content } = Layout;
    const { RangePicker } = DatePicker;

    const segments = _.get(this.state.summaries, `[${this.state.currentSummary}].segments`, []);

    console.log(this.state.summaries[this.state.currentSummary]);

    return (
      <Layout>
        <Header>
          <PageHeader
          onBack={() => window.history.back()}
          title="Placeline"
          subTitle={`${this.props.query.id}`}
          extra={
          <RangePicker
          onChange={this.onDateChange}
          ranges={{
            Today: [moment(), moment()],
            'This Week': [moment().startOf('week'), moment().endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          />} />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Row style={{ background: '#fff', padding: 24 }} >
            <Col span={8}>
              <Statistic title="Duration" value={moment.duration(_.get(this.state.summaries, `[${this.state.currentSummary}].duration`, 0), 's').humanize()} />
            </Col>
            <Col span={8}>
              <Statistic title="Distance" value={_.get(this.state.summaries, `[${this.state.currentSummary}].distance`, 0)} suffix="km" />
            </Col>
            <Col span={8}>
              <Statistic title="Steps" value={_.get(this.state.summaries, `[${this.state.currentSummary}].steps`, 0)} suffix="steps" />
            </Col>
          </Row>
          <Row style={{ padding: 24 }}>
            <Col span={24} style={timelineStyle}>
              <Timeline>
                <Timeline.Item color="green">{`Started on ${moment(_.get(this.state.summaries, `[${this.state.currentSummary}].start_datetime`, '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
                  {this.renderSegments(segments)}
                <Timeline.Item color="red">{`Ended on ${moment(_.get(this.state.summaries, `[${this.state.currentSummary}].end_datetime`, '')).format("MMMM Do YYYY, h:mmA")}`}</Timeline.Item>
              </Timeline>
            </Col>
          </Row>
          <Row style={{mpadding: 24 }}>
            <Col span={24}>
              <Map segments={segments} />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Placeline;