const Bid = require('../models/Bid');
exports.placeBid = async (req, res) => {
  const { memeId, userId, credits } = req.body;
  const bid = new Bid({ memeId, userId, credits });
  await bid.save();
  res.json(bid);
};
