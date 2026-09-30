const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', contentController.getSiteContent);
router.get('/:section', contentController.getSiteContent);
router.put('/:section', requireAdmin, contentController.updateSiteContent);

module.exports = router;
