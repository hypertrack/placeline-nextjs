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
  Icon,
  BackTop
} from "antd";
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import SVG from "react-inlinesvg";

import Map from "../components/map";
import SegmentPlaceline from "../components/segmentPlaceline";

const CALENDAR_FORMAT = "MM/DD/YY h:mmA";
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

    for (let i = 0; i < this.state.summaries.length; i++) {
      const summary = this.state.summaries[i];

      if (
        moment(summary.start_datetime).isAfter(this.state.startDate) &&
        moment(summary.end_datetime).isBefore(this.state.endDate)
      ) {
        // get all walk, drive, cycle measurements
        summary.segments.forEach(segment => {
          if (segment.type === "cycle") {
            cycle += segment.distance;
          }

          if (segment.type === "drive") {
            drive += segment.distance;
          }

          if (segment.type === "walk") {
            walk += segment.steps;
          }
        });

        segments = _.concat(segments, summary.segments);
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
    const { Panel } = Collapse;

    const customPanelStyle = {
      paddingTop: 25,
      paddingBottom: 25,
      margin: 25,
      border: 0,
      overflow: "hidden"
    };

    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
        defaultActiveKey={["1"]}
      >
        <Panel header="Timeline" key="1" style={customPanelStyle}>
          <Timeline mode="alternate">
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
        </Panel>
      </Collapse>
    );
  }

  renderOverview(currentSummaries) {
    const driveSvg = () => <SVG src={`../static/status/drive.svg`} />;
    const cycleSvg = () => <SVG src={`../static/status/cycle.svg`} />;
    const walkSvg = () => <SVG src={`../static/status/walk.svg`} />;

    return (
      <div>
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
                  groupSeparator={" "}
                  value={currentSummaries.distance}
                  suffix="meters"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Steps"
                  groupSeparator={" "}
                  value={currentSummaries.steps}
                  suffix="steps"
                />
              </Col>
            </div>
          )}
        </Row>
        <Row style={{ background: "#fff", padding: 24 }}>
          <Skeleton active loading={this.state.loading} />
          {!this.state.loading && (
            <div>
              <Col span={8}>
                <Statistic
                  prefix={
                    <Icon component={driveSvg} style={{ fontSize: "16px" }} />
                  }
                  title="Drive"
                  groupSeparator={" "}
                  value={currentSummaries.drive}
                  suffix="meters"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  prefix={
                    <Icon component={cycleSvg} style={{ fontSize: "16px" }} />
                  }
                  title="Cycle"
                  groupSeparator={" "}
                  value={currentSummaries.cycle}
                  suffix="meters"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  prefix={
                    <Icon component={walkSvg} style={{ fontSize: "16px" }} />
                  }
                  title="Walk"
                  groupSeparator={" "}
                  value={currentSummaries.walk}
                  suffix="steps"
                />
              </Col>
            </div>
          )}
        </Row>
      </div>
    );
  }

  render() {
    const { Header, Content } = Layout;
    const { RangePicker } = DatePicker;

    const currentSummaries = this.state.currentSummaries;

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
                showTime={{ format: TIME_FORMAT }}
                format={CALENDAR_FORMAT}
                onChange={date => this.onDateChange(date)}
                value={[this.state.startDate, this.state.endDate]}
                style={{ width: "100%" }}
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
            </Col>
          </Row>
          {this.renderOverview(currentSummaries)}
          {!this.state.loading && this.renderTimeline(currentSummaries)}
          <Map
            segments={currentSummaries.segments}
            selectedSegments={this.state.selectedSummaries}
            onSelection={i => this.onSegmentSelect(i)}
          />
        </Content>
        <BackTop />
      </Layout>
    );
  }
}

export default Placeline;
