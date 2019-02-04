const User = require("../../Models/User");
const { ApolloError, AuthenticationError } = require("apollo-server");

const userResolver = {
  Query: {
    user: (_, { id }) => {
      return User.findById(id);
    }
  },

  Mutation: {
    createUser: async (_, data, { user }) => {
      const userInfo = await user;

      // Check if this user exists
      var query = {
        userIdentifier: userInfo.sub
      };

      var existingUser = await User.find(query)
        .limit(1)
        .exec();

      // We have such a user. Return it.
      if (existingUser.length == 1) {
        return existingUser[0];
      } else {
        // Create a new user
        const newUser = new User({
          name: userInfo.name,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          userIdentifier: userInfo.sub,
          picture: userInfo.picture,
          paypal: ""
        });

        await newUser.save(function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        });
      }

      return newUser;
    },
    addPaypalAndEmail: async (_, { id, paypal, email }, { user }) => {
      const userInfo = await user;

      var query = {
        userIdentifier: userInfo.sub
      };

      var existingUsers = await User.find(query)
        .limit(1)
        .exec();

      if (existingUsers.length != 1) {
        throw new ApolloError("Can't find user " + id);
      } else {
        var existingUser = existingUsers[0];

        // Ensure it's the same user
        if (existingUser.userIdentifier != userInfo.sub) {
          throw new AuthenticationError("You can't change another user's data");
        }

        if (paypal != undefined && paypal != "") {
          existingUser.paypal = paypal;
        }
        if (email != undefined && email != "") {
          existingUser.email = email;
        }
        await existingUser.save(function(err) {
          if (err) {
            throw new ApolloError(err.message);
          }
        });
        return existingUser;
      }
    }
  }
};

module.exports = userResolver;
