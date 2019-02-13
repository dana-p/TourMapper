import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FormErrors from "../NewTour/FormErrors";

import GoogleMap from "../Map/GoogleMap";
import Map from "../Map/Map";
import "./Popup.css";

class AttractionPopup extends Component {
  constructor(props) {
    super(props);

    var title = "";
    var location = { lat: 0, lng: 0 };
    var markerSelected = false;
    if (props.suggestion.key !== undefined) {
      title = props.suggestion.key;
      location = props.suggestion.value;
      location = props.suggestion.value;
      markerSelected = true;
    }
    this.state = {
      title: title,
      description: "",
      markerPosition: location,
      panToLocation: markerSelected,
      formErrors: { title: "", description: "", markerPosition: "" },
      formValidity: {
        title: markerSelected,
        description: false,
        markerPosition: markerSelected
      }
    };
  }

  handleUserInput(e) {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let formValidity = this.state.formValidity;

    switch (fieldName) {
      case "title":
        formValidity.title = value.length >= 1;
        fieldValidationErrors.title = formValidity.title
          ? ""
          : " Title is too short.";
        break;
      case "description":
        formValidity.description = value.length >= 10;
        fieldValidationErrors.description = formValidity.description
          ? ""
          : " Description is too short. Minimum is 10 characters.";
        break;
      default:
        break;
    }

    fieldValidationErrors.markerPosition = formValidity.markerPosition
      ? ""
      : " Select the point on the map.";

    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValidity: formValidity
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.formValidity.title &&
        this.state.formValidity.description &&
        this.state.formValidity.markerPosition
    });
  }

  addPoint = () => {
    this.props.addPoint(this.state);
  };

  onMapClick = e => {
    let formValidity = this.state.formValidity;
    let formErrors = this.state.formErrors;
    formValidity.markerPosition = true;
    formErrors.markerPosition = ""; // Remove any error text

    this.setState(
      {
        markerPosition: e.latlng,
        formValidity: formValidity
      },
      this.validateForm
    );
  };

  render() {
    const { markerPosition } = this.state;
    const { panToLocation } = this.state;

    return (
      <div className="popup">
        <div className="popup_inner">
          <div className="popup_container">
            <div className="row">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-body text-left">
                    <div className="form-group">
                      <label className="popup_label" htmlFor="title">
                        Name of Attraction:
                      </label>
                      <input
                        type="text"
                        onChange={e => {
                          this.handleUserInput(e);
                        }}
                        className="form-control"
                        placeholder="Attraction official name"
                        id="title"
                        value={this.state.title}
                      />
                    </div>
                    <div className="form-group">
                      <label className="popup_label" htmlFor="description">
                        Description:
                      </label>
                      <textarea
                        onChange={e => {
                          this.handleUserInput(e);
                        }}
                        className="form-control"
                        placeholder="Give the description of the attraction"
                        id="description"
                      />
                    </div>
                    <Map
                      markerPosition={markerPosition}
                      panToLocation={panToLocation}
                      lastMarkerPosition={this.props.lastMarkerPosition}
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

          <button
            className="btn btn-danger popup_button"
            onClick={this.props.closePopup}
          >
            Cancel
          </button>
          <button
            disabled={!this.state.formValid}
            className="btn btn-primary popup_button"
            onClick={this.addPoint}
          >
            Add Point
          </button>
          <div className="panel panel-default">
            <FormErrors formErrors={this.state.formErrors} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AttractionPopup);
