const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/config', paymentController.getGatewayStatus);
router.post('/orders', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
