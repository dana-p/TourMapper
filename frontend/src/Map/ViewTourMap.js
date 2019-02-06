import React from "react";
import L from "leaflet";
import Locate from "leaflet.locatecontrol";
import "./Map.css";

// DANATODO: Is there any way to move this out?
const mapStyle = {
  height: "500px"
};

class ViewTourMap extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
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
    lc.start();

    if (this.props.zoomto != null) {
      this.map.setView(this.props.zoomto, 16);
    }

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
