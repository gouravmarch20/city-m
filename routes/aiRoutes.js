const express = require("express");
const { generateCaption } = require("../controllers/aiController");
const router = express.Router();
router.post("/caption", generateCaption);
module.exports = router;
