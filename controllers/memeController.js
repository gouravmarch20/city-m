const Meme = require("../models/Meme");
const multer = require("multer");

// Multer storage in memory, no disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createMeme = async (req, res) => {
  try {
    const { title, tags, ownerId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const meme = new Meme({
      title,
      image: {
        data: file.buffer, // file as Buffer
        contentType: file.mimetype,
      },
      tags: tags.split(",").map((tag) => tag.trim()),
      ownerId,
      upvotes: 0,
    });

    await meme.save();
    res.json(meme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create meme" });
  }
};

// Get all Memes
exports.getMemes = async (req, res) => {
  try {
    const memes = await Meme.find({});

    const formattedMemes = memes.map((meme) => {
      const base64Image = meme.image.data.toString("base64");
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

    res.json(formattedMemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch memes" });
  }
};
// Get Meme by ID
exports.getMemeById = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }

    const base64Image = meme.image.data.toString("base64");
    const imageUrl = `data:${meme.image.contentType};base64,${base64Image}`;

    res.json({
      _id: meme._id,
      title: meme.title,
      tags: meme.tags,
      ownerId: meme.ownerId,
      upvotes: meme.upvotes,
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meme" });
  }
};
// Upvote Meme
exports.upvoteMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }
    meme.upvotes++;
    await meme.save();
    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote meme" });
  }
};

// Downvote Meme
exports.downvoteMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }
    meme.upvotes = Math.max(0, meme.upvotes - 1); // no negative votes
    await meme.save();
    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: "Failed to downvote meme" });
  }
};

// Export multer middleware for route
exports.upload = upload.single("image"); // 'image' matches frontend form-data key
