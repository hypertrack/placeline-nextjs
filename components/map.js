import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from 'react-google-maps';
import _ from 'lodash';

class Map extends React.Component {
  render() {
    const MyMapComponent = withScriptjs(withGoogleMap(() => {
        let markerItems;
        let polyLines;

        if(this.props.devices) {
          markerItems = this.props.devices.map((device) =>
          <Marker
            options={{
              icon: {
                url: '../static/map/live.svg',
                scaledSize: { width: 32, height: 32 }
              }
            }}
            key={`label-${device.device_id}`}
            position={{ lat: _.get(device,'location.data.location.coordinates[1]'), lng: _.get(device,'location.data.location.coordinates[0]')}} />
          );
        }

        if(_.get(this.props, 'segments.length', 0) > 0) {
          polyLines = this.props.segments.map((segment, s) => {
            const polyline = segment.polyline;
            let path = [];

            if(_.get(polyline, 'length', 0) > 0) {
              for (let i = 0; i < polyline.length; i++) {
                const coordinates = polyline[i];
                path.push({lat: coordinates[0], lng: coordinates[1]});
              }
            }

            return (<Polyline
              path={path}
              key={`segment-${s}`}
              geodesic={true}
              options={{
                strokeColor: "#ffffff",
                strokeOpacity: 0.8,
                strokeWeight: 4
              }}
            />);
          });
        }

        return (<GoogleMap
          defaultZoom={this.props.zoom || 12}
          defaultCenter={ {lat: 37.7933412, lng: -122.3995876} }
          defaultOptions={{ styles: require('../static/map/GoogleMapStyles.json') }} >
          {markerItems}
          {polyLines}
        </GoogleMap>);
      }
    ));

    let bounds = undefined;

    if(typeof window !== 'undefined' && _.get(window, 'google.maps', false)) {
      bounds = new window.google.maps.LatLngBounds();

      if(this.props.devices) {
        this.props.devices.map(device => {
          const latLng = new window.google.maps.LatLng(
            _.get(device,'location.data.location.coordinates[1]'),
            _.get(device,'location.data.location.coordinates[0]'));
          bounds.extend(latLng);
          return latLng;
      });
      }
    }


    return (<div>
      <MyMapComponent
        ref={map => (typeof window !== 'undefined' && map && typeof map.fitBounds === 'function') && map.fitBounds(bounds)}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GMAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: this.props.segments ? `500px` :`100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>);
  }
}

export default Map;