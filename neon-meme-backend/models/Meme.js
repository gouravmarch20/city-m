const mongoose = require("mongoose");
const memeSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  tags: [String],
  upvotes: Number,
  ownerId: String,
});
module.exports = mongoose.model("Meme", memeSchema);

// models/Bid.js
