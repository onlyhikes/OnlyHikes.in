const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', mediaController.getMedia);
router.post('/', requireAdmin, mediaController.saveMedia);
router.delete('/:id', requireAdmin, mediaController.deleteMedia);

module.exports = router;
