import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Query, Mutation } from "react-apollo";
import { AllToursQuery, DeleteTour, ToursByUser } from "../GraphQLCalls";

import DeleteIcon from "@material-ui/icons/Delete";

import userData from "../UserService";
import Loading from "../Loading";

import "./MyTours.css";

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
    let ToursData = () => <Loading />;
    if (this.state.userId != null) {
      ToursData = ({ userId }) => (
        <Query query={ToursByUser} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return `Error! ${error.message}`;
            if (data.toursByUser.length === 0) {
              return (
                <div className="col-sm-12 col-md-4 col-lg-3">
                  <Link to="/new-tour">
                    <div className="card text-white bg-info mb-3 card-height">
                      <div className="card-header">No tours yet!</div>
                      <div className="card-body">
                        <h4 className="card-title">Create One!</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }
            return data.toursByUser.map(tour => (
              <Mutation
                mutation={DeleteTour}
                update={(cache, { data: { deleteTour } }) => {
                  const cachedTours = cache.readQuery({
                    query: ToursByUser,
                    variables: {
                      userId: userId
                    }
                  });
                  let updatedToursCache = cachedTours.toursByUser.filter(
                    tour => tour.id !== deleteTour.id
                  );

                  cache.writeQuery({
                    query: ToursByUser,
                    variables: {
                      userId: userId
                    },
                    data: {
                      toursByUser: updatedToursCache
                    }
                  });

                  try {
                    const alltours = cache.readQuery({
                      query: AllToursQuery
                    });

                    cache.writeQuery({
                      query: AllToursQuery,
                      data: {
                        tours: alltours.tours.filter(
                          tour => tour.id !== deleteTour.id
                        )
                      }
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {deleteTour => (
                  <div key={tour.id} className="col-sm-12 col-md-4 col-lg-3">
                    <div className="card text-white bg-info mb-3 card-height">
                      <div className="card-header">
                        Comments: {tour.comments.length}
                        <DeleteIcon
                          style={{ float: "right", cursor: "pointer" }}
                          onClick={() => {
                            deleteTour({
                              variables: {
                                id: tour.id
                              }
                            });
                          }}
                        />
                      </div>
                      <Link to={`/tour/${tour.id}`} style={{ color: "unset" }}>
                        <div className="card-body">
                          <h4 className="card-title">{tour.title}</h4>
                          <p className="card-text">{tour.description}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </Mutation>
            ));
          }}
        </Query>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <Link to="/new-tour">
            <div className="card text-white bg-secondary mb-3 card-height">
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
