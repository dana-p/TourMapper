import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import userData from "../UserService";
import AttractionPopup from "../Popup/Popup";
import FormErrors from "./FormErrors";

import { key } from "../google";

import syllable from "syllable";
import sum from "sum";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import Popup from "reactjs-popup";

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
      userId: "",
      backgroundColor: "white",
      showColor: true,
      titleSuggestions: []
    };

    this.hues = [0, 0, 0, 30, 30, 45, 60, 75, 90, 120, 120];
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

  setTitle = title => {
    var e = [];
    e.target = [];
    e.target.id = "title";
    e.target.value = title;
    this.handleUserInput(e);
  };

  handleUserInput(e) {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
      this.highlightText();
      this.titleSuggestion();
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

  turnOffColor = () => {
    this.setState({
      showColor: false,
      backgroundColor: "white"
    });
  };

  turnOnColor = () => {
    this.setState({
      showColor: true
    });
  };

  titleSuggestion = () => {
    var { description } = this.state;
    if (description === "") return;

    // First suggestion
    var titleSuggestions = [];
    var abstract = sum({
      corpus: description,
      nWords: 5
    });
    titleSuggestions.push(abstract.summary);
    console.log("First: ", abstract.summary);

    // Second suggestion
    abstract = sum({
      corpus: description,
      nWords: 3
    });

    if (titleSuggestions.indexOf(abstract.summary) === -1)
      titleSuggestions.push(abstract.summary);
    console.log("Second: ", abstract.summary);

    // Third suggestion
    abstract = sum({
      corpus: description,
      nWords: 5,
      emphasise: ["tour"]
    });
    console.log("Third: ", abstract.summary);
    if (titleSuggestions.indexOf(abstract.summary) === -1)
      titleSuggestions.push(abstract.summary);
    this.setState({
      titleSuggestions: titleSuggestions
    });
  };

  highlightText = () => {
    var { description, showColor } = this.state;

    if (description.length === 0 || !showColor) {
      this.setState({
        backgroundColor: "white"
      });
      return;
    }

    // Flesch reading ease formula:
    // 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words);
    // score 90-100: 5th grade, very easy to read.
    // score 60-70: 8/9th grade. Easily understood by 13-15year olds
    // score <50: college level. The lower, the more difficult.

    var syllableCount = syllable(description);
    // Sentence count -> Split on special characters (.?!) and then eliminate sentences that are just white space/empty.
    var sentenceCount = description
      .split(/\w[.?!](\s|$)/)
      .filter(x => !/^\s*$/.test(x)).length;
    var wordCount = description.split(" ").length;

    // Reading ease
    var readingEaseScore =
      206.835 -
      1.015 * (wordCount / sentenceCount) -
      84.6 * (syllableCount / wordCount);

    var val = 120; // Green
    if (readingEaseScore < 100 && readingEaseScore > 0)
      val = this.hues[Math.floor(readingEaseScore / 10)];
    else if (readingEaseScore <= 0) val = 0; // Red

    this.setState({
      backgroundColor: "hsl(" + [val, "93%", "85%"].join(", ") + ")"
    });

    // return this.processor.runSync(this.processor.parse(description))
  };

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
    },${position.lng}&key=${key}`;

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
            location: position,
            key: key
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
    const ColorInfo = () => (
      <Popup trigger={<InfoIcon className="button" />} modal>
        {close => (
          <div>
            <a className="close" onClick={close}>
              &times;
            </a>
            <Typography variant="h6" gutterBottom>
              Flesch–Kincaid readability
            </Typography>
            <Divider />
            <Typography>
              {" "}
              <br />
              The background color indicates how difficult a passage in English
              is to understand.
              <br />
              Green is text understood by children in grade 5 (11-year olds).
              <br />
              Yellow is understood by Grade 9 students.
              <br />
              Red indicated difficult to read, college level.
              <br />
              People that take your tours might not have English as their first
              language. Try to make the text easy for them to understand!
            </Typography>
            <div className="actions">
              {this.state.showColor && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.turnOffColor}
                >
                  Deactivate Colors
                </Button>
              )}
              {!this.state.showColor && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.turnOnColor}
                >
                  Activate Colors
                </Button>
              )}
              <Button
                color="primary"
                onClick={() => {
                  close();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Popup>
    );

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
                        value={this.state.title}
                      />
                      {this.state.titleSuggestions.length > 0 && (
                        <small className="form-text text-muted">
                          Suggestions:{" "}
                          {this.state.titleSuggestions.map(x => (
                            <button
                              type="button"
                              className="btn btn-link"
                              style={{
                                fontSize: "90%",
                                marginBottom: "0.5em",
                                padding: "0.5em"
                              }}
                              onClick={() => this.setTitle(x)}
                            >
                              {" "}
                              {x}{" "}
                            </button>
                          ))}
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <ColorInfo />
                      <label htmlFor="description">Description:</label>
                      <textarea
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
                        style={{
                          backgroundColor: this.state.backgroundColor,
                          color:
                            this.state.backgroundColor === "white"
                              ? ""
                              : "black"
                        }}
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
