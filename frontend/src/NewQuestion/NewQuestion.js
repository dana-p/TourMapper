import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CreateQuestionMutation = gql`
  mutation CreateQuestion($title: String!, $description: String!) {
    createQuestion(title: $title, description: $description) {
      id
      title
      description
      answers {
        answer
      }
    }
  }
`;

const QuestionsQuery = gql`
  {
    questions {
      id
      title
      description
      answers {
        answer
      }
    }
  }
`;

class NewQuestion extends Component {
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
        mutation={CreateQuestionMutation}
        update={(cache, { data: { createQuestion } }) => {
          const questions = cache.readQuery({
            query: QuestionsQuery
          });
          cache.writeQuery({
            query: QuestionsQuery,
            data: {
              questions: questions.questions.push(createQuestion)
            }
          });
          this.props.history.push("/");
        }}
      >
        {createQuestion => (
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
                        placeholder="Give your question a title"
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
                        placeholder="Give more context to your question."
                      />
                    </div>
                    <button
                      disabled={this.state.disabled}
                      className="btn btn-primary"
                      onClick={() => {
                        createQuestion({
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

export default withRouter(NewQuestion);
