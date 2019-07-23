import React, { Component } from "react";
import { Marker } from "react-google-maps";

class LocationMarker extends Component {
  render() {
    return (
      <Marker
        options={{
          icon: {
            url: this.props.offline
              ? "../static/map/offline.svg"
              : "../static/map/live.svg",
            scaledSize: { width: 32, height: 32 }
          }
        }}
        position={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
      />
    );
  }
}

export default LocationMarker;
