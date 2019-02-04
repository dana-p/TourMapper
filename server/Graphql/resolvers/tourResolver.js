const Tour = require("../../Models/Tour");
const User = require("../../Models/User");
const { AuthenticationError, ApolloError } = require("apollo-server");

// Resolvers define the technique for fetching the types in the schema
const tourResolvers = {
  Query: {
    tours: () => {
      return Tour.find();
    },
    tour: (_, { id }) => {
      return Tour.findById(id);
    },
    toursByUser: async (_, { userId }) => {
      var creator = await User.findById(userId);
      return Tour.find({ _id: { $in: creator.tours } });
    }
  },

  Mutation: {
    createTour: async (
      _,
      { title, description, location, attractions },
      { user }
    ) => {
      const userInfo = await user;
      var userInDb = await User.findOne(
        { userIdentifier: userInfo.sub },
        function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        }
      );

      const newTour = new Tour({
        title,
        description,
        location,
        author: userInfo.name,
        authorId: userInDb.id,
        comments: [],
        attractions: JSON.parse(attractions)
      });

      await newTour.save(function(err) {
        if (err) {
          throw new ApolloError(err.message);
        }
      });

      userInDb.tours.push(newTour.id);
      userInDb.save(function(err) {
        if (err) {
          throw new ApolloError(err.message);
        }
      });
      return newTour;
    },

    addCommentToTour: async (_, { id, comment }, { user }) => {
      try {
        const userInfo = await user;
        var tour = await Tour.findById(id, function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        });

        tour.comments.push({
          comment,
          author: userInfo.name
        });

        await tour.save(function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        });
        return tour;
      } catch (e) {
        throw new AuthenticationError(
          "You must be logged in to post a new comment"
        );
      }
    },
    deleteTour: async (_, { id }, { user }) => {
      const userInfo = await user;
      var userInDb = await User.findOne(
        { userIdentifier: userInfo.sub },
        function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        }
      );
      // Ensure that tours to be deleted belogs to the user:
      var index = userInDb.tours.indexOf(id);
      if (index >= 0) {
        var tour = await Tour.findByIdAndDelete(id);

        // Remove from user's array
        userInDb.tours.splice(index, 1);
        userInDb.save(function(err) {
          if (err) {
            if (err) {
              throw new ApolloError(err.message);
            }
          }
        });

        return tour;
      } else {
        throw new AuthenticationError("You can't delete someone else's tours!");
      }
    }
  }
};

module.exports = tourResolvers;
