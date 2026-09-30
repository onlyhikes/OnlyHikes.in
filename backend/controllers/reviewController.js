// ====================================================================
// ONLYHIKES.IN — REVIEWS CONTROLLER
// Real Reviews & Admin Moderation Only (Zero Fake Reviews)
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get approved reviews for public site
 */
async function getApprovedReviews(req, res, next) {
  try {
    const { hike_id } = req.query;

    if (isConfigured && supabase) {
      let query = supabase.from('reviews').select('*').eq('is_approved', true);
      if (hike_id) query = query.eq('hike_id', hike_id);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const reviews = mockDataService.getReviews({ approvedOnly: true });
    return res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all reviews for admin moderation
 */
async function getAllReviews(req, res, next) {
  try {
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('reviews').select('*, hikes(title)').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data: data || [] });
    }

    const reviews = mockDataService.getReviews({ approvedOnly: false });
    return res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

/**
 * Submit a student review
 */
async function submitReview(req, res, next) {
  try {
    const { hike_id, author_name, author_college, rating, comment } = req.body;

    if (!author_name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Name, rating (1-5), and comment are required.' });
    }

    const payload = {
      hike_id: hike_id || null,
      user_id: req.user ? req.user.id : null,
      author_name,
      author_college: author_college || 'Jaipur College Student',
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      comment,
      is_approved: false, // requires admin approval before public display
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('reviews').insert([payload]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data, message: 'Thank you! Your review will appear once approved by coordinators.' });
    }

    const saved = mockDataService.addReview(payload);
    return res.status(201).json({ success: true, data: saved, message: 'Thank you! Your review will appear once approved by coordinators.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Moderate review (approve or reject)
 * Admin protected
 */
async function moderateReview(req, res, next) {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('reviews')
        .update({ is_approved: Boolean(is_approved) })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data, message: `Review ${is_approved ? 'approved' : 'rejected'}.` });
    }

    const updated = mockDataService.moderateReview(id, Boolean(is_approved));
    return res.json({ success: true, data: updated, message: `Review ${is_approved ? 'approved' : 'rejected'}.` });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete review
 * Admin protected
 */
async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Review deleted.' });
    }

    const idx = mockDataService.reviews.findIndex(r => r.id === id);
    if (idx !== -1) mockDataService.reviews.splice(idx, 1);
    return res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getApprovedReviews,
  getAllReviews,
  submitReview,
  moderateReview,
  deleteReview
};
