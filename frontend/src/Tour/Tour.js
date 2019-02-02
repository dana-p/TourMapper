import React, { Component } from "react";
import SubmitComment from "./SubmitComment";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import ViewTourMap from "../Map/ViewTourMap";

const TourQuery = gql`
  query GetTour($id: ID!) {
    tour(id: $id) {
      id
      title
      description
      attractions {
        title
        description
        markerPosition {
          lat
          lng
        }
      }
      author
      authorId
      comments {
        comment
        author
      }
    }
  }
`;

class Tour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tour: null,
      tourId: null
    };
  }

  async componentDidMount() {
    await this.refreshTour();
  }

  async refreshTour() {
    const {
      match: { params }
    } = this.props;

    this.setState({
      tourId: params.tourId
    });
  }

  render() {
    const TourData = ({ id }) => (
      <Query query={TourQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          if (data.tour === null) return "Error, no such tour exists!";

          return (
            <div>
              <h1 className="display-3">{data.tour.title}</h1>
              <div className="subtitle1">
                A tour by{" "}
                <Link to={`/user/${data.tour.authorId}`}>
                  {data.tour.author}
                </Link>
              </div>
              <p className="lead">{data.tour.description}</p>
              <ViewTourMap markers={data.tour.attractions} />
              <hr className="my-4" />
              <SubmitComment tourId={data.tour.id} tourQuery={this.TourQuery} />

              <p>Comments:</p>
              {data.tour.comments.map((comment, idx) => (
                <p className="lead" key={idx}>
                  {comment.comment} by {comment.author}
                </p>
              ))}
            </div>
          );
        }}
      </Query>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            {!this.state.tourId && <h1>Testing</h1>}
            {this.state.tourId && <TourData id={this.state.tourId} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Tour;
