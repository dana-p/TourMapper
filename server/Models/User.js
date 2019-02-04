const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  tours: { type: Array },
  userIdentifier: { type: String, required: true },
  picture: { type: String },
  paypal: { type: String }
});

module.exports = mongoose.model("User", userSchema);
