import React, { Component } from "react";
import { Link } from "react-router-dom";

import gql from "graphql-tag";
import { Query } from "react-apollo";

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

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null
    };
  }

  render() {
    const QuestionsData = () => (
      <Query query={QuestionsQuery}>
        {({ loading, error, data }) => {
          if (loading) return "Loading tours...";
          if (error) return `Error! ${error.message}`;

          return data.questions.map(question => (
            <div key={question.id} className="col-sm-12 col-md-4 col-lg-3">
              <Link to={`/question/${question.id}`}>
                <div className="card text-white bg-success mb-3">
                  <div className="card-header">
                    Answers: {question.answers.length}
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{question.title}</h4>
                    <p className="card-text">{question.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ));
        }}
      </Query>
    );

    return (
      <div className="container">
        <div className="row">
          <Link to="/new-question">
            <div className="card text-white bg-secondary mb-3">
              <div className="card-header">Need help? Ask here!</div>
              <div className="card-body">
                <h4 className="card-title">+ New Question</h4>
                <p className="card-text">Don't worry, help is on the way!</p>
              </div>
            </div>
          </Link>
          <QuestionsData />
        </div>
      </div>
    );
  }
}

export default Questions;
