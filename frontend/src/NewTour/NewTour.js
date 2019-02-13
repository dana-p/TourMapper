import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import userData from "../UserService";
import AttractionPopup from "../Popup/Popup";
import FormErrors from "./FormErrors";

import {
  CreateTourMutation,
  AllToursQuery,
  ToursByUser
} from "../GraphQLCalls";

const styles = theme => ({
  hover: {
    cursor: "pointer"
  }
});

class NewTour extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      title: "",
      description: "",
      location: "",
      showpopup: false,
      attractions: [],
      suggestions: [],
      lastMarkerPosition: "",
      formErrors: { title: "", description: "", location: "", attractions: "" },
      formValidity: {
        title: false,
        description: false,
        location: false,
        attractions: false
      },
      formValid: false,
      userId: ""
    };
  }

  async componentDidMount() {
    var user = await userData.getUserData();
    this.setState({
      userId: user.id
    });
    this.getAttractionsNearbyCurrentLocation();
  }

  errorClass(error) {
    return error.length === 0 ? "" : "is-invalid";
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
        formValidity.title = value.length >= 3;
        fieldValidationErrors.title = formValidity.title
          ? ""
          : " Title is too short.";
        break;
      case "description":
        formValidity.description = value.length >= 20;
        fieldValidationErrors.description = formValidity.description
          ? ""
          : " Description is too short. Minimum is 10 characters.";
        break;
      case "location":
        formValidity.location = value.length > 0;
        fieldValidationErrors.location = formValidity.location
          ? ""
          : " City can't be empty.";
        break;
      default:
        break;
    }
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
        this.state.formValidity.location &&
        this.state.formValidity.attractions
    });
  }

  togglePopup = suggestion => {
    if (suggestion === undefined || suggestion.key === undefined) {
      suggestion = "";
    }
    this.setState({
      showPopup: !this.state.showPopup,
      suggestion: suggestion
    });
  };

  addPointToTour = pointInfo => {
    var { attractions } = this.state;
    attractions.push({
      title: pointInfo.title,
      description: pointInfo.description,
      markerPosition: pointInfo.markerPosition
    });
    this.setState({
      attractions: attractions,
      lastMarkerPosition: pointInfo.markerPosition
    });
    this.togglePopup();

    this.validateAttractions();
    this.checkNearbyAttractions(pointInfo.markerPosition);
  };

  getAttractionsNearbyCurrentLocation = () => {
    var self = this;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position, err) {
        if (err) {
          return;
        }
        var pos = [];
        pos.lat = position.coords.latitude;
        pos.lng = position.coords.longitude;
        self.checkNearbyAttractions(pos);
      });
    }
  };

  checkNearbyAttractions = position => {
    const urlFirst = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      position.lat
    },${position.lng}&key=AIzaSyAeN4sAOd_RfE2i83ISjp75Ol1ksylV98c`;

    var attractions = this.state.attractions;

    fetch(urlFirst)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status === "OK") {
          var plusCode = res["plus_code"]["compound_code"];
          var location = plusCode.slice(
            plusCode.indexOf(" ") + 1,
            plusCode.length
          );

          var request = {
            query: "Point of interest in " + location,
            radius: "500",
            location: position
          };
          var service = new window.google.maps.places.PlacesService(
            document.createElement("div")
          );
          service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              var suggestions = [];
              results.forEach(element => {
                // Do not display attractions that has been added to the tour.
                if (!attractions.some(attr => attr.title === element.name)) {
                  suggestions.push({
                    key: element.name,
                    value: {
                      lat: element.geometry.location.lat(),
                      lng: element.geometry.location.lng()
                    }
                  });
                }
              });
              this.setState({
                suggestions: suggestions
              });
              // }
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  checkNearbyAttractionsOld = position => {
    var request = {
      location: position,
      radius: 1000,
      type: [
        "aquarium",
        "amusement_park",
        "art_gallery",
        "city_hall",
        "church",
        "mosque",
        "museum",
        "shopping_mall",
        "synagogue",
        "train_station",
        "zoo"
      ],
      fields: ["name", "geometry", "rating"]
    };

    var service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(request, function(results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]); // THIS WORKS!
        }
      }
    });
  };

  listPointsOfAttraction = () => {
    let list = [];
    for (let i = 0; i < this.state.attractions.length; i++) {
      //Create the parent and add the children
      list.push(
        <li key={"attraction-" + i}>{this.state.attractions[i].title}</li>
      );
    }

    return list;
  };

  nearbyPoints = () => {
    const { classes } = this.props;
    return (
      <Grid container spacing={24}>
        {this.state.suggestions.map(attraction => (
          <Grid item xs={6} sm={3}>
            <Typography
              key={attraction.key}
              variant="subtitle1"
              color="textSecondary"
              classes={{ root: classes.hover }}
              onClick={() => this.togglePopup(attraction)}
            >
              {attraction.key}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  validateAttractions() {
    let formErrors = this.state.formErrors;
    let formValidity = this.state.formValidity;
    formValidity.attractions = this.state.attractions.length > 2;
    formErrors.attractions = formValidity.attractions
      ? ""
      : " You need at least three points of attraction.";

    this.setState(
      {
        formErrors: formErrors,
        formValidity: formValidity
      },
      this.validateForm
    );
  }

  render() {
    return (
      <Mutation
        mutation={CreateTourMutation}
        update={(cache, { data: { createTour } }) => {
          try {
            const tours = cache.readQuery({
              query: AllToursQuery
            });
            cache.writeQuery({
              query: AllToursQuery,
              data: {
                tours: tours.tours.push(createTour)
              }
            });
          } catch (error) {
            console.log(error);
          } finally {
            try {
              const mytours = cache.readQuery({
                query: ToursByUser,
                variables: {
                  userId: this.state.userId
                }
              });
              cache.writeQuery({
                query: ToursByUser,
                variables: {
                  userId: this.state.userId
                },
                data: {
                  toursByUser: mytours.toursByUser.push(createTour)
                }
              });
            } catch (error) {
              console.log(error);
            } finally {
              this.props.history.push("/my-tours");
            }
          }
        }}
      >
        {createTour => (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-body text-left">
                    <div className="form-group">
                      <label htmlFor="title">Title:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onChange={e => {
                          this.handleUserInput(e);
                        }} // TODO CHECK Can I not have brackets around func
                        className={`form-control ${this.errorClass(
                          this.state.formErrors.title
                        )}`}
                        placeholder="Think of an interesting title"
                        id="title"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onChange={e => {
                          this.handleUserInput(e);
                        }}
                        className={`form-control ${this.errorClass(
                          this.state.formErrors.description
                        )}`}
                        placeholder="Give a quick introduction to your tour"
                        id="description"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">City:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onChange={e => {
                          this.handleUserInput(e);
                        }}
                        className={`form-control ${this.errorClass(
                          this.state.formErrors.location
                        )}`}
                        id="location"
                      />
                    </div>
                    <div className="form-group">
                      <label>Points of Attraction:</label>
                      <ol>{this.listPointsOfAttraction()}</ol>
                      <button
                        className="btn btn-primary"
                        onClick={this.togglePopup}
                      >
                        Add Point
                      </button>
                      {this.state.showPopup ? (
                        <AttractionPopup
                          text="Close Me"
                          closePopup={this.togglePopup}
                          addPoint={this.addPointToTour}
                          lastMarkerPosition={this.state.lastMarkerPosition}
                          suggestion={this.state.suggestion}
                        />
                      ) : null}
                    </div>
                    {this.state.suggestions.length > 0 && (
                      <div className="form-group">
                        <label>Suggested nearby points. Click to add.</label>
                        {this.nearbyPoints()}
                      </div>
                    )}
                    <button
                      disabled={!this.state.formValid}
                      className="btn btn-primary"
                      onClick={() => {
                        var attr = JSON.stringify(this.state.attractions);
                        createTour({
                          variables: {
                            title: this.state.title,
                            description: this.state.description,
                            location: this.state.location,
                            attractions: attr
                          }
                        });
                      }}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

NewTour.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(NewTour));
