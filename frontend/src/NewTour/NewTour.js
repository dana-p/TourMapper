import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CreateTourMutation = gql`
  mutation CreateTour($title: String!, $description: String!) {
    createTour(title: $title, description: $description) {
      id
      title
      description
      comments {
        comment
      }
    }
  }
`;

const ToursQuery = gql`
  {
    tours {
      id
      title
      description
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
      description: ""
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
                        }} // TODO CHECK Can I not have brackes around func
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
                        placeholder="Give more context to your tour."
                      />
                    </div>
                    <button
                      disabled={this.state.disabled}
                      className="btn btn-primary"
                      onClick={() => {
                        createTour({
                          variables: {
                            title: this.state.title,
                            description: this.state.description
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
