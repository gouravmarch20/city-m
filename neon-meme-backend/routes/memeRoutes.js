const express = require('express');
const { createMeme, getMemes, upvoteMeme } = require('../controllers/memeController');
const router = express.Router();
router.post('/', createMeme);
router.get('/', getMemes);
router.post('/:id/upvote', upvoteMeme);
module.exports = router;
