import React, { Fragment, Component } from "react";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";

import SegmentPolyline from "./segmentPolyline";
import LocationMarker from "./locationMarker";

class MapContainer extends Component {
  componentDidUpdate() {
    this.map.fitBounds(this.getBounds());
  }

  componentDidMount() {
    this.map.fitBounds(this.getBounds());
  }

  getBounds() {
    let bounds = new google.maps.LatLngBounds();

    if (this.props.devices) {
      this.props.devices.map(device => {
        bounds.extend(
          new google.maps.LatLng(
            _.get(device, "location.data.location.coordinates[1]", 0),
            _.get(device, "location.data.location.coordinates[0]", 0)
          )
        );
      });
    }

    if (this.props.segments) {
      this.props.segments.map(segment => {
        if (segment.polyline && segment.polyline.length > 0) {
          for (let i = 0; i < segment.polyline.length; i++) {
            bounds.extend(
              new google.maps.LatLng(
                segment.polyline[i][0],
                segment.polyline[i][1]
              )
            );
          }
        }
      });
    }

    return bounds;
  }

  render() {
    return (
      <GoogleMap
        ref={elem => (this.map = elem)}
        zoom={15}
        center={this.getBounds()}
        options={{
          styles: require("../static/map/GoogleMapStyles.json"),
          disableDefaultUI: true,
          draggable: true,
          scaleControl: true,
          scrollwheel: true
        }}
      >
        <Fragment>
          {this.props.segments &&
            this.props.segments.map((segment, i) => (
              <SegmentPolyline
                segment={segment}
                key={`segment-${i}`}
                selected={this.props.selectedSegments[i]}
                onSelection={() => this.props.onSelection(i)}
              />
            ))}
          {this.props.devices &&
            this.props.devices.map((device, i) => (
              <LocationMarker
                key={`location-${i}`}
                offline={
                  _.get(device, "device_status", "") === "disconnected" ||
                  _.get(device, "device_status", "") === "inactive"
                }
                id={_.get(device, "device_id")}
                name={_.get(device, "device_info.name")}
                lat={_.get(device, "location.data.location.coordinates[1]")}
                lng={_.get(device, "location.data.location.coordinates[0]")}
              />
            ))}
        </Fragment>
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(MapContainer));
