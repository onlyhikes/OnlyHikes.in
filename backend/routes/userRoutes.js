const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { optionalAuth } = require('../middleware/auth');

router.get('/profile', optionalAuth, userController.getProfile);
router.put('/profile', optionalAuth, userController.updateProfile);
router.get('/explore', userController.getExploreItems);
router.get('/reviews', userController.getReviews);

module.exports = router;
