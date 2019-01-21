import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Map from "../Map/Map";
import "./Popup.css";

class AttractionPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      markerPosition: { lat: 0, lng: 0 }
    };
  }

  updateAttractionTitle = e => {
    this.setState({
      title: e
    });
  };

  updateAttractionDescription = e => {
    this.setState({
      description: e
    });
  };

  updateAttractionLatitude = e => {
    this.setState({
      coordinateLat: e
    });
  };
  updateAttractionLongitude = e => {
    this.setState({
      coordinateLong: e
    });
  };

  addPoint = () => {
    this.props.addPoint(this.state);
  };

  onMapClick = e => {
    this.setState({
      markerPosition: e.latlng
    });
  };

  render() {
    const { markerPosition } = this.state;

    return (
      <div className="popup">
        <div className="popup_inner">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-body text-left">
                    <div className="form-group">
                      <label htmlFor="attractionInput">
                        Name of Attraction:
                      </label>
                      <input
                        type="text"
                        onBlur={e => {
                          this.updateAttractionTitle(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Attraction official name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="attractionInput">Description:</label>
                      <textarea
                        onBlur={e => {
                          this.updateAttractionDescription(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Give the description of the attraction"
                      />
                    </div>
                    <Map
                      markerPosition={markerPosition}
                      mapClickEvent={this.onMapClick}
                    />
                    <div className="form-group">
                      {this.state.showPopup ? (
                        <AttractionPopup
                          closePopup={this.togglePopup.bind(this)}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={this.props.closePopup}>Cancel</button>
          <button onClick={this.addPoint}>Add Point</button>
        </div>
      </div>
    );
  }
}

export default withRouter(AttractionPopup);
