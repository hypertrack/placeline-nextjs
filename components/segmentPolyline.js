import React, { Component } from "react";
import { Polyline, Marker } from "react-google-maps";
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
      <div>
        {polyline.length > 0 && (
          <Marker
            onClick={this.props.onSelection}
            options={{
              icon: {
                url: `../static/status/${this.props.segment.type}.svg`,
                scaledSize: { width: 16, height: 16 },
                strokeColor: "red",
                style: {
                  backgroundColor: "#fff",
                  boxShadow: "0 0 6px 0 rgba(0,0,0,.1)",
                  height: "2rem",
                  width: "2rem",
                  borderRadius: "50%"
                }
              }
            }}
            position={{
              lat: polyline[0][0],
              lng: polyline[0][1]
            }}
          />
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
