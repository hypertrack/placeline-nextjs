import React, { Component } from "react";
import SVG from "react-inlinesvg";
import { Timeline, Icon } from "antd";
import moment from "moment";

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

    return (
      <Timeline.Item
        key={`segment-${id}`}
        style={{
          cursor: "pointer",
          borderRadius: "5px",
          background: this.props.selected
            ? "linear-gradient(to bottom, rgba(240,227,50,0) 20%,rgba(240,227,50,0) 25%,rgba(240,227,50,1) 26%,rgba(240,227,50,1) 74%,rgba(240,227,50,0) 75%,rgba(240,227,50,0) 80%)"
            : "white"
        }}
        onClick={this.props.onSelection}
        dot={<Icon component={activitySvg} style={{ fontSize: "16px" }} />}
      >
        <p style={{ color: "#c8dbbf" }}>
          {moment(segment.start_datetime).format("MM/DD/YY h:mmA")}
        </p>
        <p style={{ color: "#4c9e26" }}>{description}</p>
        <p>{overview}</p>
      </Timeline.Item>
    );
  }
}

export default SegmentPlaceline;
