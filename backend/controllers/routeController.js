const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');
const { mockDataService } = require('../services/mockDataService');

/**
 * Get route waypoints for a hike
 * Public endpoint
 */
async function getHikeWaypoints(req, res) {
  try {
    const { hikeId } = req.params;

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('route_waypoints')
        .select('*')
        .eq('hike_id', hikeId)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const data = mockDataService.getWaypoints(hikeId);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Route] Get waypoints error:', err);
    const data = mockDataService.getWaypoints(req.params.hikeId);
    return res.json({ success: true, data, fallback: true });
  }
}

/**
 * Get all waypoints for admin (including unpublished)
 * Admin protected
 */
async function getAllHikeWaypoints(req, res) {
  try {
    const { hikeId } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('route_waypoints')
        .select('*')
        .eq('hike_id', hikeId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const data = mockDataService.getAllWaypoints(hikeId);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Route] Get all waypoints error:', err);
    const data = mockDataService.getAllWaypoints(req.params.hikeId);
    return res.json({ success: true, data, fallback: true });
  }
}

/**
 * Create waypoint
 * Admin protected
 */
async function createWaypoint(req, res) {
  try {
    const { hikeId } = req.params;
    const waypointData = { ...req.body, hike_id: hikeId };

    if (!waypointData.title) {
      return res.status(400).json({ success: false, message: 'Waypoint title is required.' });
    }

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('route_waypoints')
        .insert([waypointData])
        .select()
        .single();

      if (error) throw error;
      mockDataService.createWaypoint(data);
      return res.status(201).json({ success: true, data, message: 'Waypoint added.' });
    }

    const created = mockDataService.createWaypoint(waypointData);
    return res.status(201).json({ success: true, data: created, message: 'Waypoint added.' });
  } catch (err) {
    console.error('[Route] Create waypoint error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to add waypoint.' });
  }
}

/**
 * Update waypoint
 * Admin protected
 */
async function updateWaypoint(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('route_waypoints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      mockDataService.updateWaypoint(id, updates);
      return res.json({ success: true, data, message: 'Waypoint updated.' });
    }

    const updated = mockDataService.updateWaypoint(id, updates);
    return res.json({ success: true, data: updated, message: 'Waypoint updated.' });
  } catch (err) {
    console.error('[Route] Update waypoint error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update waypoint.' });
  }
}

/**
 * Delete waypoint
 * Admin protected
 */
async function deleteWaypoint(req, res) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('route_waypoints').delete().eq('id', id);
      if (error) throw error;
      mockDataService.deleteWaypoint(id);
      return res.json({ success: true, message: 'Waypoint deleted.' });
    }

    mockDataService.deleteWaypoint(id);
    return res.json({ success: true, message: 'Waypoint deleted.' });
  } catch (err) {
    console.error('[Route] Delete waypoint error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to delete waypoint.' });
  }
}

module.exports = {
  getHikeWaypoints,
  getAllHikeWaypoints,
  createWaypoint,
  updateWaypoint,
  deleteWaypoint
};
