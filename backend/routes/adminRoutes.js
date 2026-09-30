const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/overview', requireAdmin, adminController.getOverview);
router.get('/users', requireAdmin, adminController.getAllUsers);

module.exports = router;
