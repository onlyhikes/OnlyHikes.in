const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { optionalAuth } = require('../middleware/auth');

router.get('/profile', optionalAuth, userController.getProfile);
router.put('/profile', optionalAuth, userController.updateProfile);
router.post('/saved', optionalAuth, userController.toggleSaveHike);

module.exports = router;
