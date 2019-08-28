import React, { Component } from "react";
import { Polyline } from "react-google-maps";
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import _ from "lodash";

class SegmentPolyline extends Component {
  render() {
    const polyline = _.get(this.props, "segment.polyline");
    let path = [];

    if (_.get(polyline, "length", 0) > 0) {
      for (let i = 0; i < polyline.length; i++) {
        const coordinates = polyline[i];
        path.push({
          lat: _.get(coordinates, "[1]", 0),
          lng: _.get(coordinates, "[0]", 0)
        });
      }
    }

    return (
      <div>
        {polyline.length > 0 && (
          <MarkerWithLabel
            onClick={this.props.onSelection}
            labelAnchor={{ x: 11, y: 18 }}
            labelStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              height: "22px",
              width: "22px",
              borderRadius: "50%",
              zIndex: "-100"
            }}
            options={{
              icon: {
                url: `../static/status/${this.props.segment.type}.svg`,
                scaledSize: { width: 16, height: 16 },
                style: {
                  zIndex: "100"
                }
              }
            }}
            position={{
              lat: _.get(polyline, "[0][1]", 0),
              lng: _.get(polyline, "[0][0]", 0)
            }}
          >
            <div />
          </MarkerWithLabel>
        )}
        <Polyline
          path={path}
          onClick={this.props.onSelection}
          geodesic={true}
          options={{
            strokeColor: this.props.selected ? "#F7B501" : "#02CE5C",
            strokeOpacity: this.props.selected ? 1 : 0.75,
            strokeWeight: this.props.selected ? 6 : 3
          }}
        />
      </div>
    );
  }
}

export default SegmentPolyline;
