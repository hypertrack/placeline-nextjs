import React, { Component } from "react";
import { Polyline, Circle } from "react-google-maps";
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import _ from "lodash";

const randomColor = require("randomcolor");

class RoutePolyline extends Component {
  constructor(props) {
    super(props);

    const polyline = _.get(props, "route.polyline.coordinates");
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

    this.state = {
      path
    };
  }

  render() {
    return (
      <div>
        {polyline && polyline.length > 0 && (
          <div>
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
                strokeColor: randomColor({
                  luminosity: "dark",
                  seed: _.get(this.props, "trip.device_id", "")
                }),
                scale: 2
              }}
              position={{
                lat: _.get(polyline, `[${polyline.length - 1}][1]`, 0),
                lng: _.get(polyline, `[${polyline.length - 1}][0]`, 0)
              }}
            >
              <div />
            </MarkerWithLabel>
            <Circle
              key={`trip-destination-${_.get(
                this.props,
                "trip.device_id",
                ""
              )}`}
              defaultCenter={{
                lat: _.get(polyline, `[${polyline.length - 1}][1]`, 0),
                lng: _.get(polyline, `[${polyline.length - 1}][0]`, 0)
              }}
              radius={_.get(this.props, "trip.destination.radius", 30)}
              options={{
                strokeOpacity: 0,
                fillColor: "#00ce5b",
                fillOpacity: 0.24
              }}
            />
          </div>
        )}
        <Polyline
          path={this.state.path}
          geodesic={true}
          options={{
            strokeColor: randomColor({
              luminosity: "dark",
              seed: _.get(this.props, "trip.device_id", "")
            }),
            strokeOpacity: 0.95,
            strokeWeight: 3
          }}
        />
      </div>
    );
  }
}

export default RoutePolyline;
