import React, { Component } from "react";
import SubmitAnswer from "./SubmitAnswer";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const QuestionQuery = gql`
  query GetQuestion($id: ID!) {
    question(id: $id) {
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

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      questionId: null
    };
  }

  async componentDidMount() {
    await this.refreshQuestion();
  }

  async refreshQuestion() {
    const {
      match: { params }
    } = this.props;

    this.setState({
      questionId: params.questionId
    });
  }

  render() {
    const QuestionData = ({ id }) => (
      <Query query={QuestionQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div>
              <h1 className="display-3">{data.question.title}</h1>
              <p className="lead">{data.question.description}</p>
              <hr className="my-4" />
              <SubmitAnswer
                questionId={data.question.id}
                questionQuery={this.QuestionQuery}
              />

              <p>Answers:</p>
              {data.question.answers.map((answer, idx) => (
                <p className="lead" key={idx}>
                  {answer.answer} by {answer.author}
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
            {!this.state.questionId && <h1>Testing</h1>}
            {this.state.questionId && (
              <QuestionData id={this.state.questionId} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
