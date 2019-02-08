import React from "react";
import Popup from "reactjs-popup";
import { withRouter } from "react-router-dom";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import "./AttractionModal.css";

import FormErrors from "../NewTour/FormErrors";
import Map from "../Map/Map";

class AttractionModal extends React.Component {
  constructor(props) {
    super(props);

    this.data = {
      title: "",
      description: "",
      markerPosition: { lat: 0, lng: 0 },
      formErrors: { title: "", description: "", markerPosition: "" },
      formValidity: {
        title: false,
        description: false,
        markerPosition: false
      }
    };
  }

  componentDidMount() {
    this.data = {
      title: "",
      description: "",
      markerPosition: { lat: 0, lng: 0 },
      formErrors: { title: "", description: "", markerPosition: "" },
      formValidity: {
        title: false,
        description: false,
        markerPosition: false
      }
    };
  }

  handleUserInput(e) {
    const name = e.target.id;
    const value = e.target.value;
    // this.setState({ [name]: value }, () => {
    //   this.validateField(name, value);
    // });
    this.data[name] = value;
    this.validateField(name, value);
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.data.formErrors;
    let formValidity = this.data.formValidity;

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

    this.data.formErrors = fieldValidationErrors;
    this.data.formValidity = formValidity;
    this.validateForm();
    // this.setState(
    //   {
    //     formErrors: fieldValidationErrors,
    //     formValidity: formValidity
    //   },
    //   this.validateForm
    // );
  }

  validateForm() {
    // this.setState({
    //   formValid:
    //     this.state.formValidity.title &&
    //     this.state.formValidity.description &&
    //     this.state.formValidity.markerPosition
    // });
    this.data.formValid =
      this.data.formValidity.title &&
      this.data.formValidity.description &&
      this.data.formValidity.markerPosition;
  }

  addPoint = () => {
    this.props.addPoint(this.data);
  };

  onMapClick = e => {
    let formValidity = this.data.formValidity;
    let formErrors = this.data.formErrors;
    formValidity.markerPosition = true;
    formErrors.markerPosition = ""; // Remove any error text

    // this.setState(
    //   {
    //     markerPosition: e.latlng,
    //     formValidity: formValidity
    //   },
    //   this.validateForm
    // );
    this.data.markerPosition = e.latlng;
    this.data.formValidity = formValidity;
    this.validateForm();
  };

  render() {
    //  const { markerPosition } = this.data;

    const Modal = () => (
      // <Popup trigger={<AddIcon />} modal>
      //    {close => (
      <div className="modal">
        {/* <a className="close" onClick={close}>
          &times;
        </a> */}
        <div className="header"> New attraction </div>
        <div className="content">
          <div className="form-group">
            <label className="popup_label" htmlFor="title">
              Name of Attraction:
            </label>
            <input
              type="text"
              onBlur={e => {
                this.handleUserInput(e);
              }}
              className="form-control"
              placeholder="Attraction official name"
              id="title"
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
            markerPosition={this.data.markerPosition}
            lastMarkerPosition={this.props.lastMarkerPosition}
            mapClickEvent={this.onMapClick}
          />
        </div>
        <div className="actions">
          <Popup
            trigger={
              <button
                disabled={!this.data.formValid}
                className="button"
                onClick={this.addPoint}
              >
                {" "}
                Add Point{" "}
              </button>
            }
            position="top center"
            closeOnDocumentClick
          >
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
              magni omnis delectus nemo, maxime molestiae dolorem numquam
              mollitia, voluptate ea, accusamus excepturi deleniti ratione
              sapiente! Laudantium, aperiam doloribus. Odit, aut.
            </span>
          </Popup>
          <button
            className="button"
            onClick={() => {
              console.log("modal closed ");
              //close();
            }}
          >
            Cancel
          </button>
        </div>
        <div className="panel panel-default">
          <FormErrors formErrors={this.data.formErrors} />
        </div>
      </div>
      //     )}
      //     </Popup>
    );

    return <Modal />;
  }
}

export default withRouter(AttractionModal);
