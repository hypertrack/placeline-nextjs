import React, { Component } from "react";
import { Polyline } from "react-google-maps";
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import _ from "lodash";

import { getDeviceColor } from "../common/devices";

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
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              strokeColor: getDeviceColor(
                _.get(this.props, "trip.device_id", "")
              ),
              scale: 5
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
            strokeColor: getDeviceColor(
              _.get(this.props, "trip.device_id", "")
            ),
            strokeOpacity: 0.95,
            strokeWeight: 3
          }}
        />
      </div>
    );
  }
}

export default RoutePolyline;
