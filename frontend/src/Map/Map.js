import React from "react";
import L from "leaflet";
import Locate from "leaflet.locatecontrol";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import { Geocoder } from "leaflet-control-geocoder";

import "./Map.css";

const mapStyle = {
  height: "300px"
};

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [43.65, -79.38],
      zoom: 17,
      layers: [
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FpeWFuZ2lybCIsImEiOiJjaWxwbzRkM2EwOHFhdWxrbmJ6NXhrYTR4In0.Zk2dnoprK00FJZ4N_FcW9A",
          {
            attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          }
        )
      ]
    });

    // this.addSeachBox(); // does not work

    this.addGeocoderSearchBox();

    // this.addGoogleSearchBox(); // would like to use instead, but clicking it clicks on map

    const lc = new Locate();
    lc.addTo(this.map);
    if (this.props.panToLocation) {
      this.map.setView(this.props.markerPosition, 16);
    } else if (
      !this.props.lastMarkerPosition ||
      this.props.lastMarkerPosition === ""
    ) {
      this.map.locate({ setView: true });
    }
    // Center the map nearby the last set marker and zoom in
    else {
      this.map.setView(this.props.lastMarkerPosition, 16);
    }

    this.map.on("click", this.props.mapClickEvent);
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);
  }

  componentDidUpdate({ markerPosition }) {
    // check if position has changed
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition);
    }
  }

  addSeachBox = () => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar"
    });
    this.map.addControl(searchControl);
  };

  addGeocoderSearchBox = () => {
    var self = this;
    L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on("markgeocode", function(e) {
        self.map.setView(e.geocode.center, 16);
        self.marker = L.marker(e.geocode.center).addTo(self.map);
        var position = [];
        position.latlng = e.geocode.center;
        self.props.mapClickEvent(position);
      })
      .addTo(self.map);
  };

  addGoogleSearchBox = () => {
    var self = this;
    var GoogleSearch = L.Control.extend({
      onAdd: function() {
        var element = document.createElement("input");
        element.id = "searchBox";
        return element;
      }
    });

    new GoogleSearch().addTo(self.map);

    var input = document.getElementById("searchBox");

    var searchBox = new window.google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", function() {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      self.marker = L.marker([
        places[0].geometry.location.lat(),
        places[0].geometry.location.lng()
      ]).addTo(self.map);
    });
  };

  render() {
    return <div id="map" style={mapStyle} />;
  }
}

export default Map;
