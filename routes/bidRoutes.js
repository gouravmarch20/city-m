const express = require('express');
const { placeBid, getBidsByMemeId, getTopMemes } = require('../controllers/bidController');

const router = express.Router();

router.post('/', placeBid);                     // Place Bid
router.post('/meme', getBidsByMemeId);   // Get Bids for Meme ID
router.get('/top-memes', getTopMemes);          // Get Top Memes

module.exports = router;