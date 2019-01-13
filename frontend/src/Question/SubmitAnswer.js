import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../Auth";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const SubmitAnswerMutation = gql`
  mutation AddAnswer($id: ID!, $answer: String!) {
    addAnswerToQuestion(id: $id, answer: $answer) {
      id
      title
      description
      answers {
        answer
        author
      }
    }
  }
`;

class SubmitAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ""
    };
  }

  updateAnswer(value) {
    this.setState({
      answer: value
    });
  }

  render() {
    if (!auth0Client.isAuthenticated()) return null;
    return (
      <Mutation
        mutation={SubmitAnswerMutation}
        key={this.props.questionId}
        update={(cache, { data: { addAnswerToQuestion } }) => {
          cache.writeQuery({
            query: this.props.questionQuery,
            data: {
              question: addAnswerToQuestion
            }
          });
        }}
      >
        {addAnswerToQuestion => (
          <Fragment>
            <div className="form-group text-center">
              <label htmlFor="answer">Answer:</label>
              <input
                type="text"
                id="answer"
                onChange={e => {
                  this.updateAnswer(e.target.value);
                }}
                className="form-control"
                placeholder="Share your answer."
                value={this.state.answer}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                addAnswerToQuestion({
                  variables: {
                    id: this.props.questionId,
                    answer: this.state.answer
                  }
                });
                this.setState({
                  answer: ""
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

export default withRouter(SubmitAnswer);
