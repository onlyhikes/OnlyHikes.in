// ====================================================================
// ONLYHIKES.IN — PICKUP MANAGEMENT CONTROLLER
// Real database-driven pickup locations & passenger counts
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get active pickup locations
 */
async function getPickups(req, res, next) {
  try {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('pickup_locations')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const pickups = mockDataService.getPickups({ activeOnly: true });
    return res.json({ success: true, data: pickups });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get pickup locations with real passenger counts
 */
async function getPickupManifest(req, res, next) {
  try {
    const { hike_id } = req.query;

    if (isConfigured && supabaseAdmin) {
      const { data: pickups, error: pErr } = await supabaseAdmin.from('pickup_locations').select('*');
      if (pErr) throw pErr;

      let bQuery = supabaseAdmin.from('bookings').select('*').neq('payment_status', 'failed');
      if (hike_id) bQuery = bQuery.eq('hike_id', hike_id);
      const { data: bookings, error: bErr } = await bQuery;
      if (bErr) throw bErr;

      const manifest = (pickups || []).map(p => {
        const assignedBookings = (bookings || []).filter(b => b.pickup_location_id === p.id);
        const studentCount = assignedBookings.reduce((sum, b) => sum + (b.seats_count || 1), 0);
        return {
          ...p,
          assignedStudentsCount: studentCount,
          bookingsCount: assignedBookings.length,
          bookings: assignedBookings
        };
      });

      return res.json({ success: true, data: manifest });
    }

    const manifest = mockDataService.getPickupManifest();
    return res.json({ success: true, data: manifest });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create pickup location
 */
async function createPickup(req, res, next) {
  try {
    const { title, landmark, pickup_time } = req.body;

    if (!title || !pickup_time) {
      return res.status(400).json({ success: false, message: 'Title and pickup time are required.' });
    }

    const newPickup = {
      title,
      landmark: landmark || '',
      pickup_time,
      is_active: true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('pickup_locations').insert([newPickup]).select().single();
      if (error) throw error;
      mockDataService.createPickup(data);
      return res.status(201).json({ success: true, data });
    }

    const created = mockDataService.createPickup(newPickup);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update pickup location
 */
async function updatePickup(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('pickup_locations').update(updates).eq('id', id).select().single();
      if (error) throw error;
      mockDataService.updatePickup(id, updates);
      return res.json({ success: true, data });
    }

    const updated = mockDataService.updatePickup(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pickup location not found.' });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPickups,
  getPickupManifest,
  createPickup,
  updatePickup
};
