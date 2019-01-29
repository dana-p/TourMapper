import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import AddIcon from "@material-ui/icons/AddCircleOutline";

import AttractionPopup from "../Popup/Popup";

const CreateTourMutation = gql`
  mutation CreateTour(
    $title: String!
    $description: String!
    $location: String!
    $attractions: String!
  ) {
    createTour(
      title: $title
      description: $description
      location: $location
      attractions: $attractions
    ) {
      id
      title
      description
      location
      attractions {
        title
      }
      comments {
        comment
        author
      }
    }
  }
`; // DANATODO: Do I need to return comments?

const ToursQuery = gql`
  {
    tours {
      id
      title
      description
      location
      comments {
        comment
      }
    }
  }
`;

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
      lastMarkerPosition: ""
    };
  }

  updateDescription(value) {
    this.setState({
      description: value
    });
  }

  updateTitle(value) {
    this.setState({
      title: value
    });
  }

  updateLocation(value) {
    this.setState({
      location: value
    });
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  addPointToTour = pointInfo => {
    console.log(pointInfo);
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
    console.log(this.state);
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

  render() {
    return (
      <Mutation
        mutation={CreateTourMutation}
        update={(cache, { data: { createTour } }) => {
          const tours = cache.readQuery({
            query: ToursQuery
          });
          cache.writeQuery({
            query: ToursQuery,
            data: {
              tours: tours.tours.push(createTour)
            }
          });
          this.props.history.push("/");
        }}
      >
        {createTour => (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-body text-left">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Title:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={e => {
                          this.updateTitle(e.target.value);
                        }} // TODO CHECK Can I not have brackets around func
                        className="form-control"
                        placeholder="Give your tour a title"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Description:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={e => {
                          this.updateDescription(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Give a quick introduction to your tour"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Location:</label>
                      <input
                        disabled={this.state.disabled}
                        type="text"
                        onBlur={e => {
                          this.updateLocation(e.target.value);
                        }} // TODO Do I need this exampleInputEmail1 everywhere?
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Points of Attraction:</label>
                      <ol>{this.listPointsOfAttraction()}</ol>
                      <AddIcon onClick={this.togglePopup.bind(this)} />
                      {this.state.showPopup ? (
                        <AttractionPopup
                          text="Close Me"
                          closePopup={this.togglePopup.bind(this)}
                          addPoint={this.addPointToTour}
                          lastMarkerPosition={this.state.lastMarkerPosition}
                        />
                      ) : null}
                    </div>
                    <button
                      disabled={this.state.disabled}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default withRouter(NewTour);
