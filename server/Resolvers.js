const Question = require("./Models/Question");
const { AuthenticationError } = require("apollo-server");

// Resolvers define the technique for fetching the types in the schema
const resolvers = {
  Query: {
    questions: () => {
      console.log("hey");
      var questions = Question.find();
      return questions;
    },
    question: (_, { id }) => {
      console.log("hey" + id);
      return Question.findById(id);
    }
  },

  Mutation: {
    createQuestion: async (_, { title, description }) => {
      const newQuestion = new Question({
        title,
        description,
        answers: []
      });
      await newQuestion.save(function(err) {
        if (err) {
          //return res.status(500).send({ message: err.message }); // TODO Will this return? Since resolvers are not middleware, I don't thinkso
          console.log("problemmmm" + err);
          throw new Error("There was an error saving new question to database");
        }
      });
      return newQuestion;
    },

    addAnswerToQuestion: async (_, { id, answer }, { user }) => {
      try {
        const userInfo = await user;
        console.log("So when adding stuff, here's what I get" + user);
        console.log("So when adding stuff, here's what I get" + userInfo);
        var question = await Question.findById(id, function(err) {
          if (err) {
            console.log("-ERROR-" + err.message);
            res.send(err);
            return;
          }
        });
        //console.log(context); // Context is prolly where req will be somehow. Need to set this up TODO
        question.answers.push({
          answer,
          author: userInfo.name
        });

        await question.save(function(err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
        });
        return question;
      } catch (e) {
        throw new AuthenticationError(
          "You must be logged in to add a new answer"
        );
      }
    }
  }
};

module.exports = resolvers;
