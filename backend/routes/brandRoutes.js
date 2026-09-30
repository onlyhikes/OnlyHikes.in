const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', brandController.getBrandSettings);
router.put('/', requireAdmin, brandController.updateBrandSettings);

module.exports = router;
