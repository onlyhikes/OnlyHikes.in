const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { requireAdmin } = require('../middleware/auth');

router.post('/validate', couponController.validateCoupon);
router.get('/', requireAdmin, couponController.getAllCoupons);
router.post('/', requireAdmin, couponController.createCoupon);

module.exports = router;
