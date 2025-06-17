const multer = require("multer");
const {
  createMemeService,
  getAllMemes,
  getMemeById,
  upvoteMeme,
  downvoteMeme,
} = require("../services/memeService");

// Multer for in-memory storage (for image binary blob)
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.upload = upload.single("image"); // field name 'image' matches frontend

// Create Meme — this one directly handles file (because file is in req.file)

exports.createMeme = async (req, res) => {
  try {
    const { title, tags, ownerId } = req.body;
    const file = req.file;

    console.log("Received Body:", req.body); // Debugging
    console.log("Received File:", file); // Debugging

    if (!file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const meme = await createMemeService({
      title,
      tags,
      ownerId,
      upvotes: 0,
      imageBuffer: file.buffer,
      contentType: file.mimetype,
    });

    res.json(meme);
  } catch (error) {
    console.error("Create Meme Error:", error); // Debugging
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};
// Rest through service
exports.getMemes = async (req, res) => {
  try {
    const memes = await getAllMemes();
    res.json(memes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemeById = async (req, res) => {
  try {
    const meme = await getMemeById(req.params.id);
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.upvoteMeme = async (req, res) => {
  try {
    const { id } = req.body; // ✅ Get id from the request body
    console.log("upvoteMeme ID:", id);

    if (!id) {
      return res
        .status(400)
        .json({ error: "ID is required in the request body" });
    }

    const meme = await upvoteMeme(id); // pass the id to your service function
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.downvoteMeme = async (req, res) => {
  try {
    const { id } = req.body; // ✅ Get id from the request body
    console.log("upvoteMeme ID:", id);

    if (!id) {
      return res
        .status(400)
        .json({ error: "ID is required in the request body" });
    }

    const meme = await downvoteMeme(id);
    res.json(meme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
