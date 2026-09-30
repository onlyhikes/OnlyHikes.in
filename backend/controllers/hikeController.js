// ====================================================================
// ONLYHIKES.IN — HIKE CONTROLLER
// Database-driven, Dynamic Pricing (Original & Selling), Dynamic Themes, No Difficulty
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get all hikes (published by default, all if admin)
 */
async function getAllHikes(req, res, next) {
  try {
    const { search, featured } = req.query;
    const isAdmin = Boolean(req.user?.is_admin || req.headers['x-admin-key']);

    if (isConfigured && supabase) {
      let query = supabase.from('hikes').select('*, hike_media(*), route_waypoints(*)');
      
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }
      if (featured === 'true') {
        query = query.eq('featured', true);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query.order('date', { ascending: true });
      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    // High-fidelity fallback
    let hikes = mockDataService.getHikes({ publishedOnly: !isAdmin, featuredOnly: featured === 'true' });
    if (search) {
      const q = search.toLowerCase();
      hikes = hikes.filter(h => h.title.toLowerCase().includes(q) || h.subtitle?.toLowerCase().includes(q));
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

    if (isConfigured && supabase) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabase
        .from('hikes')
        .select('*, hike_media(*), route_waypoints(*)');

      query = isUUID ? query.eq('id', id) : query.eq('slug', id);
      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Hike not found.' });
      }

      return res.json({ success: true, data });
    }

    const hike = mockDataService.getHikeBySlug(id) || mockDataService.getHikeById(id);
    if (!hike) {
      return res.status(404).json({ success: false, message: 'Hike not found.' });
    }

    const waypoints = mockDataService.getWaypoints(hike.id);
    return res.json({ success: true, data: { ...hike, route_waypoints: waypoints } });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new hike
 * Admin protected
 */
async function createHike(req, res, next) {
  try {
    const hikeData = req.body;

    if (!hikeData.title || !hikeData.date || !hikeData.time || !hikeData.selling_price || !hikeData.total_seats) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, time, selling_price, and total_seats are required.'
      });
    }

    const slug = hikeData.slug || hikeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      title: hikeData.title,
      slug,
      subtitle: hikeData.subtitle || '',
      poster_url: hikeData.poster_url || 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
      date: hikeData.date,
      time: hikeData.time,
      selling_price: Number(hikeData.selling_price),
      original_price: hikeData.original_price ? Number(hikeData.original_price) : null,
      total_seats: Number(hikeData.total_seats),
      booked_seats: 0,
      description: hikeData.description || '',
      included_services: hikeData.included_services || ['AC Bus Pickup & Drop', 'Guided Ridge Trail', 'Breakfast & Chai', 'Mineral Water', 'Coordinators'],
      food_info: hikeData.food_info || 'Fresh breakfast and hot ginger chai included.',
      water_info: hikeData.water_info || 'Unlimited mineral water refills provided.',
      coordinators_info: hikeData.coordinators_info || '2 Certified Trek Coordinators on every batch.',
      things_to_carry: hikeData.things_to_carry || ['Running shoes', 'College ID', 'Water bottle', 'Daypack'],
      safety_rules: hikeData.safety_rules || ['Stay on marked trail', 'Zero alcohol/substance tolerance'],
      featured: Boolean(hikeData.featured),
      background_media_url: hikeData.background_media_url || null,
      background_media_type: hikeData.background_media_type || 'image',
      primary_accent: hikeData.primary_accent || '#CCFF00',
      secondary_accent: hikeData.secondary_accent || '#FF5500',
      overlay_intensity: hikeData.overlay_intensity || 'dark',
      meta_title: hikeData.meta_title || hikeData.title,
      meta_description: hikeData.meta_description || hikeData.subtitle,
      is_published: hikeData.is_published !== undefined ? Boolean(hikeData.is_published) : true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('hikes').insert([payload]).select().single();
      if (error) throw error;
      mockDataService.createHike(data);
      return res.status(201).json({ success: true, data, message: 'Hike created successfully.' });
    }

    const created = mockDataService.createHike(payload);
    return res.status(201).json({ success: true, data: created, message: 'Hike created successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing hike
 * Admin protected
 */
async function updateHike(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    if (updates.selling_price) updates.selling_price = Number(updates.selling_price);
    if (updates.original_price) updates.original_price = Number(updates.original_price);
    if (updates.total_seats) updates.total_seats = Number(updates.total_seats);

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('hikes').update(updates).eq('id', id).select().single();
      if (error) throw error;
      mockDataService.updateHike(id, updates);
      return res.json({ success: true, data, message: 'Hike updated successfully.' });
    }

    const updated = mockDataService.updateHike(id, updates);
    return res.json({ success: true, data: updated, message: 'Hike updated successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a hike
 * Admin protected
 */
async function deleteHike(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('hikes').delete().eq('id', id);
      if (error) throw error;
      mockDataService.deleteHike(id);
      return res.json({ success: true, message: 'Hike deleted successfully.' });
    }

    mockDataService.deleteHike(id);
    return res.json({ success: true, message: 'Hike deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Duplicate a hike
 * Admin protected
 */
async function duplicateHike(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { data: original, error: fetchErr } = await supabaseAdmin.from('hikes').select('*').eq('id', id).single();
      if (fetchErr || !original) {
        return res.status(404).json({ success: false, message: 'Original hike not found.' });
      }

      const { id: _, created_at: __, updated_at: ___, ...rest } = original;
      const copyPayload = {
        ...rest,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
        booked_seats: 0,
        is_published: false
      };

      const { data: duplicated, error: insertErr } = await supabaseAdmin.from('hikes').insert([copyPayload]).select().single();
      if (insertErr) throw insertErr;

      return res.status(201).json({ success: true, data: duplicated, message: 'Hike duplicated.' });
    }

    const duplicated = mockDataService.duplicateHike(id);
    return res.status(201).json({ success: true, data: duplicated, message: 'Hike duplicated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllHikes,
  getHikeById,
  createHike,
  updateHike,
  deleteHike,
  duplicateHike
};
