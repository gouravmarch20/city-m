const express = require("express");
const {
  createMeme,
  getMemes,
  upvoteMeme,
  getMemeById,
  downvoteMeme,
  upload, // multer middleware
} = require("../controllers/memeController");

const router = express.Router();

// ✅ Apply multer middleware here for image upload
router.post("/", upload, createMeme);

router.get("/", getMemes);
router.post("/:id/upvote", upvoteMeme);
router.post("/:id/downvote", downvoteMeme);
router.get("/:id", getMemeById);

module.exports = router;