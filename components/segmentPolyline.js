import React, { Component } from "react";
import { Polyline } from "react-google-maps";
import _ from "lodash";

class SegmentPolyline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlight: this.props.highlight || false
    };
  }

  onHighlight() {
    this.setState({
      highlight: !this.state.highlight
    });
  }

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
        onClick={() => this.onHighlight()}
        geodesic={true}
        options={{
          strokeColor: this.state.highlight ? "#eb7c05" : "#02CE5C",
          strokeOpacity: this.state.highlight ? 1 : 0.75,
          strokeWeight: this.state.highlight ? 6 : 3
        }}
      />
    );
  }
}

export default SegmentPolyline;
