import React, { Component } from "react";
import { Marker } from "react-google-maps";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
import Router from "next/router";

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
        pixelOffset={new google.maps.Size(-140, -45)}
        disableAutoPan={false}
        maxWidth="150"
      >
        <div
          style={{
            backgroundColor: "#efefef",
            opacity: 0.75,
            padding: "6px 9px",
            borderRadius: "6px"
          }}
        >
          <div style={{ fontSize: `8pt`, fontColor: `#ffffff` }}>
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
            scaledSize: { width: 32, height: 32 }
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
