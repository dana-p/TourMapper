const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  comments: { type: Array, required: false },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  attractions: { type: Array, required: false }
});

module.exports = mongoose.model("Tour", tourSchema);
