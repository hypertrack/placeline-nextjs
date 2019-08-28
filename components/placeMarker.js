import React, { Component } from "react";
import { Marker } from "react-google-maps";
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
import _ from "lodash";

class PlaceMarker extends Component {
  renderInfoBox() {
    return (
      <InfoBox
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
        alignBottom={true}
        infoBoxClearance={new google.maps.Size(1, 1)}
        pixelOffset={new google.maps.Size(-140, -45)}
        disableAutoPan={false}
        maxWidth="100"
      >
        <div
          style={{
            backgroundColor: "#E2B914",
            padding: "6px 9px",
            borderRadius: "6px",
            minWidth: "50px",
            fontSize: `8pt`,
            fontColor: `#ffffff`,
            textAlign: "center"
          }}
        >
          {this.props.label}
        </div>
      </InfoBox>
    );
  }

  render() {
    return (
      <Marker
        options={{
          icon: {
            url: "../static/map/place.svg",
            scaledSize: { width: 32, height: 32 }
          }
        }}
        position={{
          lat: _.get(this.props, "lat", 0),
          lng: _.get(this.props, "lng", 0)
        }}
      >
        {this.renderInfoBox()}
      </Marker>
    );
  }
}

export default PlaceMarker;
