import React, { Fragment, Component } from "react";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";

import SegmentPolyline from "./segmentPolyline";

class MapContainer extends Component {
  render() {
    if (_.get(this.props, "segments.length", 0) > 0) {
      polyLines = this.props.segments.map((segment, s) => {
        const polyline = segment.polyline;
        let path = [];

        if (_.get(polyline, "length", 0) > 0) {
          for (let i = 0; i < polyline.length; i++) {
            const coordinates = polyline[i];
            path.push({ lat: coordinates[0], lng: coordinates[1] });
          }
        }

        return (
          <Polyline
            path={path}
            key={`segment-${s}`}
            geodesic={true}
            options={{
              strokeColor: "#ffffff",
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        );
      });
    }

    return (
      <GoogleMap
        ref={elem => (this.map = elem)}
        zoom={12}
        center={{ lat: 37.7933412, lng: -122.3995876 }}
        options={{ styles: require("../static/map/GoogleMapStyles.json") }}
      >
        <Fragment />
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(MapContainer));
