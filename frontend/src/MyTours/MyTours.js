import React, { Component } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

import Button from "@material-ui/core/Button";

import userData from "../UserService";

const ToursQuery = gql`
  query GetToursByUser($userId: String!) {
    toursByUser(userId: $userId) {
      id
      title
      description
      comments {
        comment
      }
    }
  }
`;

const DeleteTour = gql`
  mutation DeleteTour($id: ID!) {
    deleteTour(id: $id) {
      id
      title
      description
      comments {
        comment
      }
    }
  }
`;

class MyTours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tours: null,
      userId: null
    };
  }

  async componentDidMount() {
    var user = await userData.getUserData();
    this.setState({
      userId: user.id
    });
  }

  render() {
    let ToursData = () => <h1>Loading your tours...</h1>;
    if (this.state.userId != null) {
      ToursData = ({ userId }) => (
        <Query query={ToursQuery} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading tours...";
            if (error) return `Error! ${error.message}`;
            if (data.toursByUser.length == 0) {
              return "No tours yet! Create one!";
            }
            return data.toursByUser.map(tour => (
              <div key={tour.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/tour/${tour.id}`}>
                  <div className="card text-white bg-success mb-3">
                    <div className="card-header">
                      Comments: {tour.comments.length}
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{tour.title}</h4>
                      <p className="card-text">{tour.description}</p>
                    </div>
                  </div>
                </Link>
                <Mutation
                  mutation={DeleteTour}
                  update={(cache, { data: { deleteTour } }) => {
                    const cachedTours = cache.readQuery({
                      query: ToursQuery,
                      variables: {
                        userId: userId
                      }
                    });
                    let updatedToursCache = cachedTours.toursByUser.filter(
                      tour => tour.id !== deleteTour.id
                    );

                    cache.writeQuery({
                      query: ToursQuery,
                      variables: {
                        userId: userId
                      },
                      data: {
                        toursByUser: updatedToursCache
                      }
                    });
                  }}
                >
                  {deleteTour => (
                    <Button
                      onClick={() => {
                        deleteTour({
                          variables: {
                            id: tour.id
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Mutation>
              </div>
            ));
          }}
        </Query>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <Link to="/new-tour">
            <div className="card text-white bg-secondary mb-3">
              <div className="card-header">Want to add a tour? Start here!</div>
              <div className="card-body">
                <h4 className="card-title">+ New Tour</h4>
                <p className="card-text">Thank you for your contribution!</p>
              </div>
            </div>
          </Link>
          <ToursData userId={this.state.userId} />
        </div>
      </div>
    );
  }
}

export default MyTours;
