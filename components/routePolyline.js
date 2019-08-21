import React, { Component } from "react";
import { Polyline } from "react-google-maps";
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import _ from "lodash";

class RoutePolyline extends Component {
  render() {
    const polyline = _.get(this.props, "route.polyline.coordinates");
    let path = [];

    if (_.get(polyline, "length", 0) > 0) {
      for (let i = 0; i < polyline.length; i++) {
        const coordinates = polyline[i];
        path.push({ lat: coordinates[1], lng: coordinates[0] });
      }
    }

    return (
      <div>
        {polyline.length > 0 && (
          <MarkerWithLabel
            labelAnchor={{ x: 11, y: 18 }}
            labelStyle={{
              height: "22px",
              width: "22px",
              borderRadius: "50%",
              zIndex: "-100"
            }}
            position={{
              lat: polyline[polyline.length - 1][1],
              lng: polyline[polyline.length - 1][0]
            }}
          >
            <div />
          </MarkerWithLabel>
        )}
        <Polyline
          path={path}
          geodesic={true}
          options={{
            strokeColor: "#02CE5C",
            strokeOpacity: 0.75,
            strokeWeight: 3
          }}
        />
      </div>
    );
  }
}

export default RoutePolyline;
