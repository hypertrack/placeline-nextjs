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
  notification
} from "antd";
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import styled from "styled-components";

import Map from "../components/map";
import SegmentPlaceline from "../components/segmentPlaceline";
import ExportConfirmation from "../components/exportConfirmation";

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
      addedSegments: [],
      startDate: moment().startOf("week"),
      endDate: moment().endOf("week"),
      loading: true
    };
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    this.getSummaries();
  }

  shortenLargeNumber(num, digits, meters = true) {
    if (num <= -1000 || num >= 1000) {
      return {
        number: +(num / 1000).toFixed(digits),
        unit: meters ? "km" : "k"
      };
    }

    return { number: num, unit: meters ? "m" : "steps" };
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
      url: `${process.env.SERVER_URL}/devices/${this.props.query.id}/trips`
    };

    axios(options).then(resp => {
      this.setState(
        {
          summaries: resp.data
            .map(function(trip, i) {
              return {
                tripNumber: i,
                summary: trip.summary
              };
            })
            .filter(x => x.summary !== null)
        },
        () => this.selectSummaries()
      );
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  selectSummaries() {
    let tripNumbers = [],
      segments = [],
      duration = 0,
      distance = 0,
      steps = 0,
      walk = 0,
      drive = 0,
      cycle = 0;

    // do not render health segments, only activity events
    const relevantSegments = ["run", "drive", "cycle", "stop", "walk"];

    for (let i = 0; i < this.state.summaries.length; i++) {
      const { tripNumber, summary } = this.state.summaries[i];

      if (
        summary &&
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
              tripNumbers.push(tripNumber);
              segments.push(segment);
            }
          }
        });

        duration += _.get(summary, "duration", 0);
        distance += _.get(summary, "distance", 0);
        steps += _.get(summary, "steps", 0);
      }
    }

    this.setState({
      currentSummaries: {
        tripNumbers,
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
      addedSegments: _.xor(this.state.addedSegments, [i])
    });
  }

  onExpenseSubmitted(expense) {
    if (expense.submitted) {
      notification["success"]({
        message: "Report sent",
        description: `Expense report for $${expense.amount} (${
          expense.distance
        } km) on ${moment(expense.date).format(
          "ll"
        )} was submitted successfully`
      });

      this.setState({
        addedSegments: []
      });
    }
  }

  renderSegments(tripNumbers, segments) {
    return segments.map((segment, i) => (
      <SegmentPlaceline
        segment={segment}
        selected={this.state.selectedSummaries.includes(i)}
        added={this.state.addedSegments.includes(i)}
        onAdd={() => this.onSegmentAdd(i)}
        onSelection={() => this.onSegmentSelect(i)}
        id={tripNumbers[i]}
        key={`segment-${i}-${tripNumbers[i]}`}
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
        {this.renderSegments(
          currentSummaries.tripNumbers,
          currentSummaries.segments
        )}
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
                    this.shortenLargeNumber(currentSummaries.distance, 1).number
                  }
                  suffix={
                    this.shortenLargeNumber(currentSummaries.distance, 1).unit
                  }
                />
              </Row>
              <Row>
                <Statistic
                  title="Steps"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={
                    this.shortenLargeNumber(currentSummaries.steps, 1, false)
                      .number
                  }
                  suffix={
                    this.shortenLargeNumber(currentSummaries.steps, 1, false)
                      .unit
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
                  value={
                    this.shortenLargeNumber(currentSummaries.drive, 1).number
                  }
                  suffix={
                    this.shortenLargeNumber(currentSummaries.drive, 1).unit
                  }
                />
              </Row>
              <Row>
                <Statistic
                  title="Cycle"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={
                    this.shortenLargeNumber(currentSummaries.cycle, 1).number
                  }
                  suffix={
                    this.shortenLargeNumber(currentSummaries.cycle, 1).unit
                  }
                />
              </Row>
              <Row>
                <Statistic
                  title="Walk"
                  style={{ padding: "10px" }}
                  groupSeparator={" "}
                  value={
                    this.shortenLargeNumber(currentSummaries.walk, 1, false)
                      .number
                  }
                  suffix={
                    this.shortenLargeNumber(currentSummaries.walk, 1, false)
                      .unit
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
    const { Sider, Content } = Layout;
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
              <ExportConfirmation
                count={this.state.addedSegments.length}
                segments={this.state.addedSegments.map(
                  i => this.state.currentSummaries.segments[i]
                )}
                onSubmitSuccess={expense => this.onExpenseSubmitted(expense)}
              />
            }
          />
          <Row style={{ background: "#FFF", height: "64px" }}>
            <RangePicker
              showTime={{ format: TIME_FORMAT }}
              format={CALENDAR_FORMAT}
              allowClear={false}
              autoFocus={true}
              diabled={this.state.loading}
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
            loading={this.state.loading}
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
