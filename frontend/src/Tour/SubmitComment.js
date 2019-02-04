import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../Auth";

import { Mutation } from "react-apollo";

import { SubmitCommentMutation } from "../GraphQLCalls";

class SubmitComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
  }

  updateComment(value) {
    this.setState({
      comment: value
    });
  }

  render() {
    if (!auth0Client.isAuthenticated()) return null;
    return (
      <Mutation
        mutation={SubmitCommentMutation}
        key={this.props.tourId}
        update={(cache, { data: { addCommentToTour } }) => {
          cache.writeQuery({
            query: this.props.tourQuery,
            data: {
              tour: addCommentToTour
            }
          });
        }}
      >
        {addCommentToTour => (
          <Fragment>
            <div className="form-group text-center">
              <label htmlFor="commentInput">Comment:</label>
              <input
                type="text"
                id="commentInput"
                onChange={e => {
                  this.updateComment(e.target.value);
                }}
                className="form-control"
                placeholder="Share your comment."
                value={this.state.comment}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                addCommentToTour({
                  variables: {
                    id: this.props.tourId,
                    comment: this.state.comment
                  }
                });
                this.setState({
                  comment: ""
                });
              }}
            >
              Submit
            </button>
            <hr className="my-4" />
          </Fragment>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SubmitComment);
