import React from "react";
import L from "leaflet";
import "./Map.css";

const mapStyle = {
  height: "300px"
};

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [49.8419, 24.0315],
      zoom: 17,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    if (
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

  render() {
    return <div id="map" style={mapStyle} />;
  }
}

export default Map;
