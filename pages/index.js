import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Button } from 'antd';
import styled from 'styled-components';

let currentLocation;

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={props.setLocation ? 16 : 8}
    defaultCenter={props.setLocation || {lat: 37.7933412, lng: -122.3995876} }
    >
    {props.setLocation && <Marker position={props.setLocation} />}
  </GoogleMap>
));

const StyledButton = styled(Button)`
    position: fixed;
    left: 20px;
    top: 20px;
    z-index: 9999;
`;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
     }
}

function showPosition(position) {
    currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    console.log(currentLocation);
  }

const Index = () => (
        <div>
            <StyledButton type="primary" shape="circle" icon="compass" onClick={getLocation}/>
            <MyMapComponent
                setLocation={currentLocation}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6V1v4K6l_nm-W9KdCLMObqDgU0znIt-w&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
);

export default Index;