import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { notification } from 'antd';
import io from 'socket.io-client';
import _ from 'lodash';
import moment from 'moment';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: undefined,
      activity: undefined,
      health: undefined,
      summary: undefined,
      trip: undefined
    };
  }

  componentDidMount() {
    this.socket = io('https://ht-dev-ag.localtunnel.me');

    this.socket.on('location', location => {
      notification.success({
        message: `Received new location update`,
        description: `Device ID: ${location.device_id}`
      });
      this.setState({ location });
    });

    this.socket.on('activity', location => {
      this.setState({ activity });
    });

    this.socket.on('health', location => {
      this.setState({ health });
    });

    this.socket.on('summary', location => {
      this.setState({ summary });
    });

    this.socket.on('trip', location => {
      this.setState({ trip });
    });
  }

  render() {
    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={(props.coordinates.lat && props.coordinates.lng) ? 14 : 8}
        defaultCenter={(props.coordinates.lat && props.coordinates.lng) ? props.coordinates : {lat: 37.7933412, lng: -122.3995876} }
        >
        {(props.coordinates.lat && props.coordinates.lng) &&
          <MarkerWithLabel
            position={props.coordinates}
            labelAnchor={new google.maps.Point(100, -15)}
          >
            <div>{moment(props.label).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
          </MarkerWithLabel>}
      </GoogleMap>
    ));

    const coordinates = { lat: _.get(this.state.location, 'data.location.coordinates[0]'), lng: _.get(this.state.location, 'data.location.coordinates[1]') };

    return (
      <div>
            <MyMapComponent
                coordinates={coordinates}
                label={_.get(this.state.location, 'recorded_at')}
                googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyD6V1v4K6l_nm-W9KdCLMObqDgU0znIt-w&v=3.exp&libraries=geometry,drawing,places'
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
  }
}

export default Index;