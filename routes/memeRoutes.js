const express = require("express");
const {
  createMeme,
  upload,
  getMemes,
  getMemeById,
  upvoteMeme,
  downvoteMeme,
} = require("../controllers/memeController");

const router = express.Router();

router.post("/", upload, createMeme);
router.get("/", getMemes);
router.get("/:id", getMemeById);
router.post("/upvote", upvoteMeme);
router.post("/downvote", downvoteMeme);

module.exports = router;
