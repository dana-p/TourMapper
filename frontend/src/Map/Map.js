import React from "react";
import L from "leaflet";
import Locate from "leaflet.locatecontrol";

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

    const lc = new Locate();
    lc.addTo(this.map);

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
