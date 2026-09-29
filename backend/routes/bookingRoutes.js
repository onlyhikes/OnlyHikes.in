const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

router.post('/', optionalAuth, bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.get('/', requireAdmin, bookingController.getAllBookings);

module.exports = router;
