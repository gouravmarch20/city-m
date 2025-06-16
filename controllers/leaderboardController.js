const Meme = require("../models/Meme");
exports.getLeaderboard = async (req, res) => {
  const top = parseInt(req.query.top) || 10;
  const memes = await Meme.find().sort({ upvotes: -1 }).limit(top);
  res.json(memes);
};
