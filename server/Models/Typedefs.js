const { gql } = require("apollo-server");

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # The Question typedef and its query
  type Answer {
    answer: String
    author: String
  }

  type Question {
    id: ID!
    title: String!
    description: String!
    answers: [Answer]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    questions: [Question]
    question(id: ID!): Question
  }
  type Mutation {
    createQuestion(title: String!, description: String!): Question
    addAnswerToQuestion(id: ID!, answer: String!): Question
  }
`;

module.exports = typeDefs;
