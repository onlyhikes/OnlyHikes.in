const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { requireAdmin } = require('../middleware/auth');

router.get('/hike/:hikeId', routeController.getHikeWaypoints);
router.get('/hike/:hikeId/all', requireAdmin, routeController.getAllHikeWaypoints);
router.post('/hike/:hikeId', requireAdmin, routeController.createWaypoint);
router.put('/:id', requireAdmin, routeController.updateWaypoint);
router.delete('/:id', requireAdmin, routeController.deleteWaypoint);

module.exports = router;
