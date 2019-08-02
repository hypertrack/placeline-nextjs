import React, { Component } from "react";
import SVG from "react-inlinesvg";
import { Timeline, Icon, Row, Col } from "antd";
import moment from "moment";
import styled from "styled-components";

class SegmentPlaceline extends Component {
  render() {
    const { segment, id } = this.props;
    const segmentsWithSteps = ["run", "stop", "walk"];

    const activitySvg = () => (
      <SVG src={`../static/status/${segment.type}.svg`} />
    );

    let description = "";
    let overview = "";

    if (segment.start_place && segment.end_place) {
      description += `From ${segment.start_place} to ${segment.end_place}`;
    }

    if (segment.duration > 0 || segment.steps > 0 || segment.distance > 0) {
      overview += `${segment.distance} m | `;

      // only show steps for run, stop, and walk
      if (segmentsWithSteps.indexOf(segment.type) >= 0) {
        overview += `${segment.steps} steps | `;
      }

      overview += `${moment.duration(segment.duration, "s").humanize()}`;
    }

    const StyledItem = styled(Timeline.Item)`
      cursor: pointer;
      background: ${this.props.selected ? "#fff9e8" : "white"};
      padding: 0 15px;

      .ant-timeline-item-tail {
        left: 29px;
        top: 0;
        height: 100%;
      }

      .ant-timeline-item-head {
        left: 30px;
      }

      .ant-timeline-item-head-custom {
        background: transparent;
      }

      .ant-timeline-item-head-custom {
        top: 45%;
      }
    `;

    return (
      <StyledItem
        key={`segment-${id}`}
        dot={<Icon component={activitySvg} style={{ fontSize: "16px" }} />}
      >
        <Row type="flex" justify="space-around" align="middle" gutter={8}>
          <Col offset={4} span={16} onClick={this.props.onSelection}>
            <p style={{ color: "#D3D3D3", marginTop: "15px" }}>
              {moment(segment.start_datetime).format("MM/DD/YY h:mmA")}
            </p>
            <p style={{ color: "#737373" }}>{description}</p>
            <p style={{ marginBottom: "15px" }}>{overview}</p>
          </Col>
          <Col span={4}>
            <Icon
              onClick={this.props.onAdd}
              style={{
                fontSize: "16pt",
                color: this.props.added ? "#03CE5C" : "#1890FF"
              }}
              type={this.props.added ? "check" : "plus"}
            />
          </Col>
        </Row>
      </StyledItem>
    );
  }
}

export default SegmentPlaceline;
