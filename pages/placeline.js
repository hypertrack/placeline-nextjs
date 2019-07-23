import {
  Layout,
  Statistic,
  Row,
  Col,
  Timeline,
  PageHeader,
  DatePicker,
  Skeleton,
  Collapse,
  Icon
} from "antd";
import axios from "axios";
import moment from "moment";
import _ from "lodash";

import Map from "../components/map";

class Placeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summaries: [],
      startDate: moment(new Date()).add(-1, "days"),
      endDate: moment(),
      loading: true
    };
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    this.getSummaries();
  }

  onDateChange(date) {
    this.setState({
      startDate: date[0],
      endDate: date[1]
    });
  }

  getSummaries() {
    // get last summaries for selected device
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/summaries/${this.props.query.id}`
    };

    axios(options).then(resp => {
      this.setState({
        summaries: resp.data,
        loading: false
      });
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  selectSummaries() {
    let segments = [],
      duration = 0,
      distance = 0,
      steps = 0;

    for (let i = 0; i < this.state.summaries.length; i++) {
      const summary = this.state.summaries[i];

      if (moment(summary.start_datetime).isAfter(this.state.startDate, "day")) {
        segments = _.concat(segments, summary.segments);
        duration += summary.duration;
        distance += summary.distance;
        steps += summary.steps;
      }
    }

    return {
      segments,
      duration,
      distance,
      steps,
      start_datetime: this.state.startDate,
      end_datetime: this.state.endDate
    };
  }

  renderSegments(segments) {
    return segments.map((segment, i) => (
      <Timeline.Item key={`segment-${i}`}>{`${moment(
        segment.start_datetime
      ).format("MMMM Do YYYY, h:mmA")} - ${moment(segment.end_datetime).format(
        "MMMM Do YYYY, h:mmA"
      )}: ${this.capitalizeFirstLetter(segment.type)} from ${
        segment.start_place
      } to ${segment.end_place} (${segment.distance0} m | ${
        segment.steps
      } steps | ${moment
        .duration(segment.duration, "s")
        .humanize()})`}</Timeline.Item>
    ));
  }

  render() {
    const { Header, Content } = Layout;
    const { Panel } = Collapse;
    const { RangePicker } = DatePicker;

    const currentSummaries = this.selectSummaries();

    const customPanelStyle = {
      background: "#f0f2f5",
      borderRadius: 0,
      paddingTop: 25,
      paddingBottom: 25,
      margin: 0,
      border: 0,
      overflow: "hidden"
    };

    return (
      <Layout>
        <Header>
          <PageHeader
            onBack={() => window.history.back()}
            title="Overview"
            subTitle={
              this.props.query.name !== ""
                ? this.props.query.name
                : this.props.query.id
            }
          />
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Row style={{ background: "#f0f2f5", padding: 25 }}>
            <Col span={12} offset={6}>
              <RangePicker
                size="large"
                onChange={date => this.onDateChange(date)}
                value={[this.state.startDate, this.state.endDate]}
                style={{ width: "100%" }}
                ranges={{
                  Today: [moment(), moment()],
                  "This Week": [
                    moment().startOf("week"),
                    moment().endOf("week")
                  ],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month")
                  ]
                }}
              />
            </Col>
          </Row>
          <Row style={{ background: "#fff", padding: 24 }}>
            <Skeleton active loading={this.state.loading} />
            {!this.state.loading && (
              <div>
                <Col span={8}>
                  <Statistic
                    title="Duration"
                    value={moment
                      .duration(currentSummaries.duration, "s")
                      .humanize()}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Distance"
                    value={currentSummaries.distance}
                    suffix="m"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Steps"
                    value={currentSummaries.steps}
                    suffix="steps"
                  />
                </Col>
              </div>
            )}
          </Row>
          <Skeleton active loading={this.state.loading} />
          {!this.state.loading && (
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
              defaultActiveKey={["1"]}
            >
              <Panel header="Timeline" key="1" style={customPanelStyle}>
                <Timeline>
                  <Timeline.Item color="green">{`${moment(
                    currentSummaries.start_datetime
                  ).format(
                    "MMMM Do YYYY, h:mmA"
                  )}: Started activity`}</Timeline.Item>
                  {this.renderSegments(currentSummaries.segments)}
                  <Timeline.Item color="red">{`${moment(
                    currentSummaries.end_datetime
                  ).format(
                    "MMMM Do YYYY, h:mmA"
                  )}: Completed activity`}</Timeline.Item>
                </Timeline>
              </Panel>
            </Collapse>
          )}
        </Content>
        <Map segments={currentSummaries.segments} />
      </Layout>
    );
  }
}

export default Placeline;
