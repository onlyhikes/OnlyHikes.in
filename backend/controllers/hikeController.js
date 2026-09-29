// ====================================================================
// ONLYHIKES.IN — HIKE CONTROLLER
// ====================================================================

const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get all published hikes (or all hikes if requested by admin)
 */
async function getAllHikes(req, res, next) {
  try {
    const { difficulty, search } = req.query;

    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('hikes').select('*, pickup_locations(*)');
      
      if (!req.user || !req.user.is_admin) {
        query = query.eq('is_published', true);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query.order('date', { ascending: true });
      if (error) throw error;
      return res.json({ success: true, data });
    }

    // High-fidelity fallback
    let hikes = mockStore.getHikes();
    if (!req.user || !req.user.is_admin) {
      hikes = hikes.filter(h => h.is_published);
    }
    if (difficulty) {
      hikes = hikes.filter(h => h.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      hikes = hikes.filter(h => h.title.toLowerCase().includes(q) || h.subtitle.toLowerCase().includes(q));
    }

    return res.json({ success: true, data: hikes });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single hike by ID or slug
 */
async function getHikeById(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabaseAdmin
        .from('hikes')
        .select('*, hike_images(*), pickup_locations(*)');

      query = isUUID ? query.eq('id', id) : query.eq('slug', id);
      const { data, error } = await query.single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hike trail not found.' });
      }

      return res.json({ success: true, data });
    }

    // Fallback store
    const hike = mockStore.getHikeByIdOrSlug(id);
    if (!hike) {
      return res.status(404).json({ success: false, message: 'Hike trail not found.' });
    }

    const pickups = mockStore.getPickups(hike.id);
    return res.json({ success: true, data: { ...hike, pickup_locations: pickups } });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create a new hike
 */
async function createHike(req, res, next) {
  try {
    const {
      title,
      slug,
      subtitle,
      poster_url,
      date,
      time,
      price,
      total_seats,
      difficulty,
      description,
      included_services,
      things_to_carry,
      safety_rules,
      is_published
    } = req.body;

    if (!title || !price || !total_seats || !poster_url) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, total_seats, and poster_url are required.'
      });
    }

    const hikeSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newHike = {
      id: `hike-${Date.now()}`,
      slug: hikeSlug,
      title,
      subtitle: subtitle || '',
      poster_url,
      date: date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      time: time || 'Sunday · 5:30 AM',
      price: Number(price),
      total_seats: Number(total_seats),
      booked_seats: 0,
      difficulty: difficulty || 'Moderate',
      description: description || '',
      included_services: included_services || [
        'Pickup & Drop',
        'Guided Hike',
        'Food',
        'Water',
        'Trek Coordinators'
      ],
      things_to_carry: things_to_carry || [
        'Comfortable Shoes',
        'Water Bottle',
        'Campus ID'
      ],
      safety_rules: safety_rules || [
        'Stay with coordinator',
        'Stay on trail'
      ],
      is_published: is_published !== false
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('hikes').insert(newHike).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockStore.addHike(newHike);
    return res.status(201).json({ success: true, data: newHike });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update hike (e.g. dynamic poster replacement, seats, etc.)
 */
async function updateHike(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('hikes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const updated = mockStore.updateHike(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hike not found.' });
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete hike
 */
async function deleteHike(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('hikes').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Hike deleted successfully.' });
    }

    const deleted = mockStore.deleteHike(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hike not found.' });
    }

    return res.json({ success: true, message: 'Hike deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllHikes,
  getHikeById,
  createHike,
  updateHike,
  deleteHike
};
