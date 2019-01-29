import React, { Component } from "react";
import { Link } from "react-router-dom";

import gql from "graphql-tag";
import { Query } from "react-apollo";

import ListOfTours from "./ListOfTours";

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

class Tours extends Component {
  render() {
    const ToursData = () => (
      <Query query={ToursQuery}>
        {({ loading, error, data }) => {
          if (loading) return "Loading tours...";
          if (error) return `Error! ${error.message}`;

          return <ListOfTours tours={data.tours} />;
        }}
      </Query>
    );

    return (
      <div className="container">
        <div className="row">
          <ToursData />
          <Link to="/new-tour">
            <div className="card text-white bg-secondary mb-3">
              <div className="card-header">Want to add a tour? Start here!</div>
              <div className="card-body">
                <h4 className="card-title">+ New Tour</h4>
                <p className="card-text">Thank you for your contribution!</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default Tours;
