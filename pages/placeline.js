import {
  Layout,
  Statistic,
  Row,
  Col,
  Timeline,
  PageHeader,
  DatePicker,
  Skeleton,
  Icon,
  Button,
  Badge
} from "antd";
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import styled from "styled-components";

import Map from "../components/map";
import SegmentPlaceline from "../components/segmentPlaceline";

import { shortenLargeNumber } from "../common/helper";

const CALENDAR_FORMAT = "MM/DD/YY";
const TIME_FORMAT = "h:mmA";

class Placeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summaries: [],
      currentSummaries: {},
      filteredSummaries: [],
      selectedSummaries: [],
      addedSummaries: [],
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
      filteredSummaries: new Array(segments.length).fill(false),
      loading: false
    });
  }

  onSegmentSelect(i) {
    this.setState({
      selectedSummaries: _.xor(this.state.selectedSummaries, [i])
    });
  }

  onSegmentAdd(i) {
    this.setState({
      addedSummaries: _.xor(this.state.addedSummaries, [i])
    });
  }

  renderSegments(segments) {
    return segments.map((segment, i) => (
      <SegmentPlaceline
        segment={segment}
        selected={this.state.selectedSummaries.includes(i)}
        added={this.state.addedSummaries.includes(i)}
        onAdd={() => this.onSegmentAdd(i)}
        onSelection={() => this.onSegmentSelect(i)}
        id={i}
        key={i}
      />
    ));
  }

  renderTimeline(currentSummaries) {
    const StyledItem = styled(Timeline.Item)`
      cursor: pointer;
      background: ${this.props.selected ? "#E0F9EB" : "white"};

      .ant-timeline-item-tail {
        left: 29px;
      }

      .ant-timeline-item-head {
        left: 30px;
      }

      .ant-timeline-item-head-custom {
        background: transparent;
      }

      .ant-timeline-item-content {
        margin: 0 0 0 43px;
      }
    `;

    return (
      <Timeline style={{ padding: "25px 0" }}>
        <StyledItem
          dot={<Icon type="play-circle" style={{ fontSize: "16px" }} />}
          color="green"
        >
          {moment(currentSummaries.start_datetime).format(CALENDAR_FORMAT)}
        </StyledItem>
        {this.renderSegments(currentSummaries.segments)}
        <StyledItem
          dot={<Icon type="check-circle" style={{ fontSize: "16px" }} />}
          color="green"
        >
          {moment(currentSummaries.end_datetime).format(CALENDAR_FORMAT)}
        </StyledItem>
      </Timeline>
    );
  }

  renderOverview(currentSummaries) {
    return (
      <Row
        style={{
          maxHeight: "calc(50vh - 128px)",
          padding: "25px",
          background: "#F0F2F5",
          overflow: "scroll"
        }}
      >
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
                  value={
                    shortenLargeNumber(currentSummaries.distance, 1).number
                  }
                  suffix={shortenLargeNumber(currentSummaries.distance, 1).unit}
                />
              </Row>
              <Row>
                <Statistic
                  title="Steps"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={
                    shortenLargeNumber(currentSummaries.steps, 1, false).number
                  }
                  suffix={
                    shortenLargeNumber(currentSummaries.steps, 1, false).unit
                  }
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
                  value={shortenLargeNumber(currentSummaries.drive, 1).number}
                  suffix={shortenLargeNumber(currentSummaries.drive, 1).unit}
                />
              </Row>
              <Row>
                <Statistic
                  title="Cycle"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={shortenLargeNumber(currentSummaries.cycle, 1).number}
                  suffix={shortenLargeNumber(currentSummaries.cycle, 1).unit}
                />
              </Row>
              <Row>
                <Statistic
                  title="Walk"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={
                    shortenLargeNumber(currentSummaries.walk, 1, false).number
                  }
                  suffix={
                    shortenLargeNumber(currentSummaries.walk, 1, false).unit
                  }
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
        <Sider width="25%" style={{ backgroundColor: "#fff" }}>
          <PageHeader
            onBack={() => window.history.back()}
            title="Overview"
            style={{ backgroundColor: "#fff", height: "64px" }}
            subTitle={
              this.props.query.name !== ""
                ? this.props.query.name
                : this.props.query.id
            }
            extra={
              <Badge count={this.state.addedSummaries.length}>
                <Button type="primary" shape="circle" icon="upload" />
              </Badge>
            }
          />
          <Row style={{ background: "#FFF", height: "64px" }}>
            <RangePicker
              showTime={{ format: TIME_FORMAT }}
              format={CALENDAR_FORMAT}
              onChange={date => this.onDateChange(date)}
              value={[this.state.startDate, this.state.endDate]}
              style={{ width: "80%", marginLeft: "10%", padding: "16px" }}
              ranges={{
                Today: [moment().startOf("day"), moment().endOf("day")],
                "This Week": [moment().startOf("week"), moment().endOf("week")],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month")
                ]
              }}
            />
          </Row>
          {this.renderOverview(currentSummaries)}
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
    );
  }
}

export default Placeline;
