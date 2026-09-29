// ====================================================================
// ONLYHIKES.IN — PICKUP MANAGEMENT CONTROLLER
// Database-driven pickup locations & passenger counts (NO generic meeting points)
// ====================================================================

const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get pickup locations (optionally filtered by hike)
 */
async function getPickups(req, res, next) {
  try {
    const { hike_id } = req.query;

    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('pickup_locations').select('*');
      if (hike_id) {
        query = query.or(`hike_id.eq.${hike_id},hike_id.is.null`);
      }
      const { data, error } = await query.eq('is_active', true);
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const pickups = mockStore.getPickups(hike_id);
    return res.json({ success: true, data: pickups });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get pickup locations with passenger counts
 */
async function getPickupManifest(req, res, next) {
  try {
    const { hike_id } = req.query;

    const pickups = isConfigured && supabaseAdmin
      ? (await supabaseAdmin.from('pickup_locations').select('*')).data || []
      : mockStore.pickups;

    const bookings = isConfigured && supabaseAdmin
      ? (await supabaseAdmin.from('bookings').select('*')).data || []
      : mockStore.bookings;

    // Aggregate student counts per pickup
    const manifest = pickups.map(p => {
      const assignedBookings = bookings.filter(b => 
        (b.pickup_location_id === p.id || (b.pickup_title && b.pickup_title.includes(p.title))) &&
        (!hike_id || b.hike_id === hike_id) &&
        b.payment_status !== 'failed'
      );
      const studentCount = assignedBookings.reduce((sum, b) => sum + (b.seats_count || 1), 0);
      return {
        ...p,
        assignedStudentsCount: studentCount,
        bookingsCount: assignedBookings.length,
        isCapacityFull: studentCount >= (p.capacity || 50)
      };
    });

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
    const { hike_id, title, landmark, pickup_time, map_url, capacity } = req.body;

    if (!title || !landmark || !pickup_time) {
      return res.status(400).json({ success: false, message: 'Title, landmark, and pickup time are required.' });
    }

    const newPickup = {
      id: `pk-${Date.now()}`,
      hike_id: hike_id || null,
      title,
      landmark,
      pickup_time,
      map_url: map_url || `https://maps.google.com/?q=${encodeURIComponent(title + ' ' + landmark + ' Jaipur')}`,
      capacity: Number(capacity) || 50,
      is_active: true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('pickup_locations').insert(newPickup).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockStore.pickups.push(newPickup);
    return res.status(201).json({ success: true, data: newPickup });
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
      return res.json({ success: true, data });
    }

    const idx = mockStore.pickups.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockStore.pickups[idx] = { ...mockStore.pickups[idx], ...updates };
      return res.json({ success: true, data: mockStore.pickups[idx] });
    }

    return res.status(404).json({ success: false, message: 'Pickup location not found.' });
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
