import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Query } from "react-apollo";
import { AllToursQuery } from "../GraphQLCalls";

import ListOfTours from "./ListOfTours";
import Welcome from "./Welcome";

import Loading from "../Loading";

class Tours extends Component {
  render() {
    const ToursData = () => (
      <Query query={AllToursQuery}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;

          return <ListOfTours tours={data.tours} />;
        }}
      </Query>
    );

    return (
      <div className="container">
        <Welcome />
        <div className="row">
          <ToursData />
        </div>
      </div>
    );
  }
}

export default Tours;
