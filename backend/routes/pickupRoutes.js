const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', pickupController.getPickups);
router.get('/manifest', requireAdmin, pickupController.getPickupManifest);
router.post('/', requireAdmin, pickupController.createPickup);
router.put('/:id', requireAdmin, pickupController.updatePickup);

module.exports = router;
