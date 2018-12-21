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
const path = require('path');

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

// Config
const config = require("./server/config");

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

monDb.once("open", function callback() {
  console.info("Connected to MongoDB:", config.MONGO_URI);
});

require('./server/api')(app, config);

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

// Pass routing to React app
if (process.env.NODE_ENV !== 'dev') {
  app.use(express.static(path.join(__dirname, 'frontend','build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend','build','index.html'));
  });
}else{
  mongoose.set('debug', true);
}

//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(process.env.PORT || 8081, () => { // process.env.PORT assigned by Heroku
  console.log("Listening on port 8081");
});
