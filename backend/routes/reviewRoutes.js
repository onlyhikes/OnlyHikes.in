const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

router.get('/', reviewController.getApprovedReviews);
router.get('/admin', requireAdmin, reviewController.getAllReviews);
router.post('/', optionalAuth, reviewController.submitReview);
router.put('/:id/moderate', requireAdmin, reviewController.moderateReview);
router.delete('/:id', requireAdmin, reviewController.deleteReview);

module.exports = router;
