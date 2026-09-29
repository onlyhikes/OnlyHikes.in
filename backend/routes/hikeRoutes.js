const express = require('express');
const router = express.Router();
const hikeController = require('../controllers/hikeController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

router.get('/', optionalAuth, hikeController.getAllHikes);
router.get('/:id', hikeController.getHikeById);
router.post('/', requireAdmin, hikeController.createHike);
router.put('/:id', requireAdmin, hikeController.updateHike);
router.delete('/:id', requireAdmin, hikeController.deleteHike);

module.exports = router;
