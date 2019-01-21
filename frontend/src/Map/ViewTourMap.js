import React from "react";
import L from "leaflet";
import "./Map.css";

class ViewTourMap extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: this.props.markers[0].markerPosition,
      zoom: 17,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    this.map.setView(this.props.markers[0].markerPosition, 17);

    this.map.locate({ setView: true });
    let here = this;

    this.props.markers.forEach(function(markerInfo) {
      var marker = L.marker(markerInfo.markerPosition).addTo(here.map);
      marker.bindPopup(
        "<b>" + markerInfo.title + "</b><br></br>" + markerInfo.description
      );
    });
  }

  render() {
    return <div id="map" className="leaflet-container" />;
  }
}

export default ViewTourMap;
