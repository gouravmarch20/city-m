const {
  placeBid,
  getBidsByMemeId,
  getTopMemes,
} = require("../services/bidService");

exports.placeBid = async (req, res) => {
  try {
    console.log("placebi");
    const { memeId, userId, credits } = req.body;
    if (!memeId || !userId || !credits) {
      return res
        .status(400)
        .json({ error: "memeId, userId, and credits are required" });
    }

    // const bid = await placeBid({ memeId, userId, credits });

    const bid = await placeBid({
      memeid: memeId, // Postgres expects lowercase "memeid"
      userid: userId, // Postgres expects lowercase "userid"
      credits: credits,
    });

    res.json({ message: "Bid placed successfully!", bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBidsByMemeId = async (req, res) => {
  try {
    const { memeId } = req.body; // 👈 shifted from params to body

    if (!memeId) {
      return res.status(400).json({ error: "memeId is required in body" });
    }
    console.log("memeId" , memeId)
    const bids = await getBidsByMemeId(memeId);
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopMemes = async (req, res) => {
  try {
    const memes = await getTopMemes();
    res.json(memes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
