const Meme = require("../models/Meme");
exports.createMeme = async (req, res) => {
  const { title, imageUrl, tags, ownerId } = req.body;
  const meme = new Meme({ title, imageUrl, tags, ownerId, upvotes: 0 });
  await meme.save();
  res.json(meme);
};
exports.getMemes = async (req, res) => {
  const memes = await Meme.find();
  res.json(memes);
};
exports.upvoteMeme = async (req, res) => {
  const meme = await Meme.findById(req.params.id);
  meme.upvotes++;
  await meme.save();
  res.json(meme);
};
