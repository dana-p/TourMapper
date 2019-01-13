/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const express = require("express");
const bodyParser = require("body-parser"); // Convert incoming req to JSON
const cors = require("cors");
const helmet = require("helmet"); // Secure Express app with various HTTP headers
const morgan = require("morgan"); // Logging
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./server/Models/Typedefs");
const resolvers = require("./server/Resolvers");
const config = require("./server/config");

/*
 |--------------------------------------
 | Authetication 
 |--------------------------------------
 */
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa"); // Retrieve RSA public keys from JWKS

/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined")); // Log HTTP requests
app.use(methodOverride("X-HTTP-Method-Override"));

const client = jwksRsa({
  jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}
const options = {
  issuer: `https://tour-mapper.auth0.com/`,
  algorithms: ["RS256"]
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // simple auth check on every request
    const token = req.headers.authorization;
    //  if (token === "undefined" || token === null) return {}; // DANATODO PROBABLY DON'T NEED THIS ANYMORE

    const user = new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
    return {
      user
    };
  }
});

/*
 |--------------------------------------
 | MongoDB
 |--------------------------------------
 */

mongoose.connect(config.MONGO_URI);
const monDb = mongoose.connection;

monDb.on("error", function() {
  console.error(
    "MongoDB Connection Error. Please make sure that",
    config.MONGO_URI,
    "is running."
  );
});

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

// // Pass routing to React app
// if (process.env.NODE_ENV !== "dev") {
//   server.express.use(express.static(path.join(__dirname, "frontend", "build")));
//   server.express.get("/*", function(req, res) {
//     res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
//   });
// } else {
//   mongoose.set("debug", true);
// }

// Pass routing to React app
if (process.env.NODE_ENV !== "dev") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  mongoose.set("debug", true);
}

// //build mode
// server.express.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/public/index.html"));
// });

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

server.applyMiddleware({ app });

monDb.once("open", function callback() {
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
