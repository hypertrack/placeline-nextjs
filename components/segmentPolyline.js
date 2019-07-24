import React, { Component } from "react";
import { Polyline } from "react-google-maps";
import _ from "lodash";

class SegmentPolyline extends Component {
  render() {
    const polyline = _.get(this.props, "segment.polyline");
    let path = [];

    if (_.get(polyline, "length", 0) > 0) {
      for (let i = 0; i < polyline.length; i++) {
        const coordinates = polyline[i];
        path.push({ lat: coordinates[0], lng: coordinates[1] });
      }
    }

    return (
      <Polyline
        path={path}
        onClick={this.props.onSelection}
        geodesic={true}
        options={{
          strokeColor: this.props.selected ? "#f0e332" : "#02CE5C",
          strokeOpacity: this.props.selected ? 1 : 0.75,
          strokeWeight: this.props.selected ? 6 : 3
        }}
      />
    );
  }
}

export default SegmentPolyline;
