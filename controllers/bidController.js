const Bid = require('../models/Bid');
const Meme = require('../models/Meme');

// Place a new Bid
exports.placeBid = async (req, res) => {
  try {
    const { memeId, userId, credits } = req.body;

    if (!memeId || !userId || !credits) {
      return res.status(400).json({ error: "memeId, userId and credits are required" });
    }

    const bid = new Bid({ memeId, userId, credits });
    await bid.save();

    res.json({ message: "Bid placed successfully!", bid });
  } catch (err) {
    console.error("Place bid error:", err);
    res.status(500).json({ error: "Failed to place bid" });
  }
};

// Get all Bids for a specific Meme ID
exports.getBidsByMemeId = async (req, res) => {
  try {
    const { memeId } = req.params;
    const bids = await Bid.find({ memeId }).sort({ credits: -1 }); // Highest bid first
    res.json(bids);
  } catch (err) {
    console.error("Get bids error:", err);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
};

// Get Top Memes (by upvotes)
exports.getTopMemes = async (req, res) => {
  try {
    const memes = await Meme.find({})
      .sort({ upvotes: -1 }) // Highest upvotes
      .limit(5); // Top 5

    // Return image in Base64 format (if needed)
    const topMemes = memes.map(meme => {
      const base64Image = meme.image.data.toString('base64');
      const imageUrl = `data:${meme.image.contentType};base64,${base64Image}`;
      return {
        _id: meme._id,
        title: meme.title,
        tags: meme.tags,
        ownerId: meme.ownerId,
        upvotes: meme.upvotes,
        imageUrl,
      };
    });

    res.json(topMemes);
  } catch (err) {
    console.error("Get top memes error:", err);
    res.status(500).json({ error: "Failed to fetch top memes" });
  }
};