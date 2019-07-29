import {
  Layout,
  Statistic,
  Row,
  Col,
  Timeline,
  PageHeader,
  DatePicker,
  Skeleton,
  Icon
} from "antd";
import axios from "axios";
import moment from "moment";
import _ from "lodash";

import Map from "../components/map";
import SegmentPlaceline from "../components/segmentPlaceline";

const CALENDAR_FORMAT = "MM/DD/YY";
const TIME_FORMAT = "h:mmA";

class Placeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summaries: [],
      currentSummaries: {},
      selectedSummaries: [],
      startDate: moment().startOf("day"),
      endDate: moment().endOf("day"),
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
    this.setState(
      {
        startDate: date[0],
        endDate: date[1]
      },
      () => this.selectSummaries()
    );
  }

  getSummaries() {
    // get last summaries for selected device
    const options = {
      method: "get",
      url: `${process.env.SERVER_URL}/summaries/${this.props.query.id}`
    };

    axios(options).then(resp => {
      this.setState(
        {
          summaries: resp.data
        },
        () => this.selectSummaries()
      );
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  selectSummaries() {
    let segments = [],
      duration = 0,
      distance = 0,
      steps = 0,
      walk = 0,
      drive = 0,
      cycle = 0;

    // do not render health segments, only activity events
    const relevantSegments = ["run", "drive", "cycle", "stop", "walk"];

    for (let i = 0; i < this.state.summaries.length; i++) {
      const summary = this.state.summaries[i];

      if (
        moment(summary.start_datetime).isAfter(this.state.startDate) &&
        moment(summary.end_datetime).isBefore(this.state.endDate)
      ) {
        summary.segments.forEach(segment => {
          // get all walk, drive, cycle measurements
          if (segment.type === "cycle") {
            cycle += segment.distance;
          }

          if (segment.type === "drive") {
            drive += segment.distance;
          }

          if (segment.type === "walk") {
            walk += segment.steps;
          }

          if (relevantSegments.indexOf(segment.type) >= 0) {
            // disregard sgements that are way to short to be relevant
            if (
              segment.distance > 5 ||
              segment.steps > 10 ||
              segment.duration > 60
            ) {
              segments.push(segment);
            }
          }
        });

        duration += summary.duration;
        distance += summary.distance;
        steps += summary.steps;
      }
    }

    this.setState({
      currentSummaries: {
        segments,
        duration,
        distance,
        steps,
        start_datetime: this.state.startDate,
        end_datetime: this.state.endDate,
        walk,
        cycle,
        drive
      },
      selectedSummaries: new Array(segments.length).fill(false),
      loading: false
    });
  }

  onSegmentSelect(i) {
    let currentSelected = this.state.selectedSummaries;

    currentSelected[i] = !currentSelected[i];

    this.setState({
      selectSummaries: currentSelected
    });
  }

  renderSegments(segments) {
    return segments.map((segment, i) => (
      <SegmentPlaceline
        segment={segment}
        selected={this.state.selectedSummaries[i]}
        onSelection={() => this.onSegmentSelect(i)}
        id={i}
        key={i}
      />
    ));
  }

  renderTimeline(currentSummaries) {
    return (
      <Timeline style={{ padding: "50px" }}>
        <Timeline.Item
          dot={<Icon type="play-circle" style={{ fontSize: "16px" }} />}
          color="green"
        >
          {moment(currentSummaries.start_datetime).format(CALENDAR_FORMAT)}
        </Timeline.Item>
        {this.renderSegments(currentSummaries.segments)}
        <Timeline.Item
          dot={<Icon type="check-circle" style={{ fontSize: "16px" }} />}
          color="green"
        >
          {moment(currentSummaries.end_datetime).format(CALENDAR_FORMAT)}
        </Timeline.Item>
      </Timeline>
    );
  }

  renderOverview(currentSummaries) {
    return (
      <Row style={{ padding: "25px" }}>
        <Col span={12}>
          <Skeleton active loading={this.state.loading} />
          {!this.state.loading && (
            <div>
              <Row>
                <Statistic
                  title="Duration"
                  style={{ padding: "10px" }}
                  value={moment
                    .duration(currentSummaries.duration, "s")
                    .humanize()}
                />
              </Row>
              <Row>
                <Statistic
                  title="Distance"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={currentSummaries.distance}
                  suffix="meters"
                />
              </Row>
              <Row>
                <Statistic
                  title="Steps"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={currentSummaries.steps}
                  suffix="steps"
                />
              </Row>
            </div>
          )}
        </Col>
        <Col span={12}>
          <Skeleton active loading={this.state.loading} />
          {!this.state.loading && (
            <div>
              <Row>
                <Statistic
                  title="Drive"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={currentSummaries.drive}
                  suffix="meters"
                />
              </Row>
              <Row>
                <Statistic
                  title="Cycle"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={currentSummaries.cycle}
                  suffix="meters"
                />
              </Row>
              <Row>
                <Statistic
                  title="Walk"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={currentSummaries.walk}
                  suffix="steps"
                />
              </Row>
            </div>
          )}
        </Col>
      </Row>
    );
  }

  render() {
    const { Sider, Header, Content } = Layout;
    const { RangePicker } = DatePicker;

    const currentSummaries = this.state.currentSummaries;

    return (
      <Layout>
        <PageHeader
          onBack={() => window.history.back()}
          title="Overview"
          style={{ backgroundColor: "#fff", height: "64px" }}
          subTitle={
            this.props.query.name !== ""
              ? this.props.query.name
              : this.props.query.id
          }
        />
        <Layout>
          <Sider width="25%" style={{ backgroundColor: "#fff" }}>
            <Row style={{ background: "#F0F2F5", height: "64px" }}>
              <RangePicker
                showTime={{ format: TIME_FORMAT }}
                format={CALENDAR_FORMAT}
                onChange={date => this.onDateChange(date)}
                value={[this.state.startDate, this.state.endDate]}
                style={{ width: "80%", marginLeft: "10%", padding: "10px" }}
                ranges={{
                  Today: [moment().startOf("day"), moment().endOf("day")],
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
            </Row>
            <Row
              style={{
                height: "calc(50vh - 128px)"
              }}
            >
              {this.renderOverview(currentSummaries)}
            </Row>
            <Row
              style={{
                height: "50vh",
                overflow: "scroll",
                overflowX: "hidden"
              }}
            >
              {!this.state.loading && this.renderTimeline(currentSummaries)}
            </Row>
          </Sider>
          <Content style={{ padding: "0" }}>
            <Map
              segments={currentSummaries.segments}
              selectedSegments={this.state.selectedSummaries}
              onSelection={i => this.onSegmentSelect(i)}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Placeline;
