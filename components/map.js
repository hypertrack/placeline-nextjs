import React, { Component } from "react";
import { Skeleton } from "antd";
import MapContainer from "./mapContainer";

const API_KEY = process.env.GMAPS_KEY;
const MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

class Map extends Component {
  render() {
    const containerStyles = {
      height: this.props.height ? this.props.height : "100vh",
      width: "100%"
    };

    if (this.props.loading) {
      return <Skeleton active loading={true} style={{ padding: "24px" }} />;
    }

    return (
      <MapContainer
        googleMapURL={MAP_URL}
        loadingElement={<div style={containerStyles} />}
        containerElement={<div style={containerStyles} />}
        mapElement={<div style={containerStyles} />}
        {...this.props}
      />
    );
  }
}

export default Map;
