const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/active', optionalAuth, voteController.getActiveRound);
router.post('/cast', requireAuth, voteController.castVote);
router.post('/rounds', requireAdmin, voteController.createRound);

module.exports = router;
