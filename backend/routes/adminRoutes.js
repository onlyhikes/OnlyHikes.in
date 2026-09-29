const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/overview', requireAdmin, adminController.getOverview);
router.get('/export-csv', requireAdmin, adminController.exportBookingsCsv);

module.exports = router;
