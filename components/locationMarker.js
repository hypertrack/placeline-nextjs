import React, { Component } from "react";
import { Marker } from "react-google-maps";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
import Router from "next/router";

import { getDeviceColor } from "../common/devices";

class LocationMarker extends Component {
  onInfoBoxClick() {
    Router.push(
      `/placeline?id=${this.props.id}&name=${encodeURIComponent(
        this.props.name
      )}`
    );
  }

  renderInfoBox() {
    return (
      <InfoBox
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
        alignBottom={true}
        infoBoxClearance={new google.maps.Size(1, 1)}
        pixelOffset={new google.maps.Size(-165, -45)}
        disableAutoPan={false}
        maxWidth="200px"
      >
        <div
          style={{
            backgroundColor: getDeviceColor(this.props.id),
            opacity: 0.95,
            padding: "3px 6px",
            borderRadius: "3px"
          }}
        >
          <div style={{ fontSize: `7pt`, color: `#ffffff` }}>
            {this.props.name}
          </div>
        </div>
      </InfoBox>
    );
  }

  render() {
    return (
      <Marker
        onClick={() => this.onInfoBoxClick()}
        options={{
          icon: {
            url: this.props.offline
              ? "../static/map/offline.svg"
              : "../static/map/live.svg",
            scaledSize: { width: 25, height: 25 }
          }
        }}
        position={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
      >
        {this.renderInfoBox()}
      </Marker>
    );
  }
}

export default LocationMarker;
