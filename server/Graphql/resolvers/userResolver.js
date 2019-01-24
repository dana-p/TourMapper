const User = require("../../Models/User");

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
          picture: userInfo.picture
        });

        await newUser.save(function(err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
        });
      }

      return newUser;
    }
  }
};

module.exports = userResolver;
