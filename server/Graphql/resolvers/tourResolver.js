const Tour = require("../../Models/Tour");
const { AuthenticationError } = require("apollo-server");

// Resolvers define the technique for fetching the types in the schema
const tourResolvers = {
  Query: {
    tours: () => {
      return Tour.find();
    },
    tour: (_, { id }) => {
      return Tour.findById(id);
    }
  },

  Mutation: {
    createTour: async (_, { title, description, attractions }, { user }) => {
      const userInfo = await user;
      const newTour = new Tour({
        title,
        description,
        author: userInfo.name,
        comments: [],
        attractions: JSON.parse(attractions)
      });

      await newTour.save(function(err) {
        if (err) {
          //return res.status(500).send({ message: err.message }); // TODO Will this return? Since resolvers are not middleware, I don't thinkso
          throw new Error("There was an error saving new tour to database");
        }
      });
      return newTour;
    },

    addCommentToTour: async (_, { id, comment }, { user }) => {
      try {
        const userInfo = await user;
        var tour = await Tour.findById(id, function(err) {
          if (err) {
            res.send(err);
            return;
          }
        });

        tour.comments.push({
          comment,
          author: userInfo.name
        });

        await tour.save(function(err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
        });
        return tour;
      } catch (e) {
        throw new AuthenticationError(
          "You must be logged in to post a new comment"
        );
      }
    }
  }
};

module.exports = tourResolvers;
