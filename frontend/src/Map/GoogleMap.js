import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  height: "300px",
  width: "100%"
};

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false, //Hides or the shows the infoWindow
      activeMarker: {}, //Shows the active marker upon click
      selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
    };
  }

  // componentDidMount() {
  //   // create map
  //   this.map = L.map("map", {
  //     center: [43.65, -79.38],
  //     zoom: 17,
  //     layers: [
  //       L.tileLayer(
  //         "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FpeWFuZ2lybCIsImEiOiJjaWxwbzRkM2EwOHFhdWxrbmJ6NXhrYTR4In0.Zk2dnoprK00FJZ4N_FcW9A",
  //         {
  //           attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
  //         }
  //       )
  //     ]
  //   });

  //   // this.addSeachBox();

  //   var self = this;
  //   L.Control.geocoder({
  //     defaultMarkGeocode: false
  //   })
  //     .on("markgeocode", function(e) {
  //       self.map.setView(e.geocode.center, 16);
  //       self.marker = L.marker(e.geocode.center).addTo(self.map);
  //     })
  //     .addTo(self.map);

  //   const lc = new Locate();
  //   lc.addTo(this.map);

  //   if (
  //     !this.props.lastMarkerPosition ||
  //     this.props.lastMarkerPosition === ""
  //   ) {
  //     this.map.locate({ setView: true });
  //   }
  //   // Center the map nearby the last set marker and zoom in
  //   else {
  //     this.map.setView(this.props.lastMarkerPosition, 16);
  //   }

  //   this.map.on("click", this.props.mapClickEvent);
  //   this.marker = L.marker(this.props.markerPosition).addTo(this.map);
  // }

  render() {
    return (
      <div style={mapStyles}>
        <Map
          centerAroundCurrentLocation
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={
            this.props.lastMarkerPosition
              ? this.props.lastMarkerPosition
              : {
                  lat: 40.854885,
                  lng: -88.081807
                }
          }
          onClick={this.props.mapClickEvent}
        >
          {this.props.markerPosition && (
            <Marker position={this.props.markerPosition} />
          )}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCGby-2CdrGUWmmzII9TfzrN_u-05QskjI"
})(GoogleMap);
