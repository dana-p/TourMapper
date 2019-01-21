import React from "react";
import L from "leaflet";
import "./Map.css";

// DANATODO: Is there any way to move this out?
const mapStyle = {
  height: "500px"
};

class ViewTourMap extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: this.props.markers[0].markerPosition,
      zoom: 16,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    this.map.setView(this.props.markers[0].markerPosition, 16);

    let self = this;
    this.props.markers.forEach(function(markerInfo) {
      var marker = L.marker(markerInfo.markerPosition).addTo(self.map);
      marker.bindPopup(
        "<b>" + markerInfo.title + "</b><br></br>" + markerInfo.description
      );
    });
  }

  render() {
    return <div id="map" style={mapStyle} />;
  }
}

export default ViewTourMap;
