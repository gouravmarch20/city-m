const mongoose = require("mongoose");

const memeSchema = new mongoose.Schema({
  title: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  tags: [String],
  ownerId: String,
  upvotes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Meme", memeSchema);
