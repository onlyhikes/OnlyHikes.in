const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

router.get('/active', optionalAuth, voteController.getActiveRound);
router.post('/cast', optionalAuth, voteController.castVote);
router.put('/toggle', requireAdmin, voteController.toggleRound);
router.post('/rounds', requireAdmin, voteController.createRound);

module.exports = router;
