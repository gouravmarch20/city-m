const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
  memeId: String,
  userId: String,
  credits: Number
});
module.exports = mongoose.model('Bid', bidSchema);