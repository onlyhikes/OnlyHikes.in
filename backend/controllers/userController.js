// ====================================================================
// ONLYHIKES.IN — USER & STUDENT PROFILE CONTROLLER
// Real profile, real bookings, and saved hikes (Zero referrals)
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get student profile with real bookings and saved hikes
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let userBookings = [];
    let profileData = null;
    let savedHikes = [];

    if (isConfigured && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle();
      profileData = profile;

      const { data: bData } = await supabaseAdmin
        .from('bookings')
        .select('*, hikes(title, date, time, poster_url, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      userBookings = bData || [];

      const { data: sData } = await supabaseAdmin
        .from('saved_hikes')
        .select('hike_id, hikes(*)')
        .eq('user_id', userId);
      savedHikes = (sData || []).map(s => s.hikes).filter(Boolean);
    } else {
      profileData = mockDataService.users.find(u => u.id === userId) || {
        id: userId,
        full_name: 'Student Adventurer',
        email: 'student@onlyhikes.in',
        phone: '+91 98290 12345',
        college: 'MNIT Jaipur',
        city: 'Jaipur'
      };
      userBookings = mockDataService.bookings.filter(b => b.user_id === userId);
      savedHikes = mockDataService.getSavedHikes(userId);
    }

    return res.json({
      success: true,
      data: {
        profile: profileData,
        bookings: userBookings,
        saved_hikes: savedHikes
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update student profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { full_name, phone, college, city } = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ full_name, phone, college, city, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const updated = {
      id: userId,
      full_name,
      phone,
      college,
      city
    };
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Toggle saved hike for current user
 */
async function toggleSaveHike(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to save hikes.' });
    }

    const { hike_id } = req.body;
    if (!hike_id) {
      return res.status(400).json({ success: false, message: 'Hike ID is required.' });
    }

    if (isConfigured && supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('saved_hikes')
        .select('id')
        .eq('user_id', userId)
        .eq('hike_id', hike_id)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin.from('saved_hikes').delete().eq('id', existing.id);
        return res.json({ success: true, saved: false, message: 'Hike removed from saved list.' });
      } else {
        await supabaseAdmin.from('saved_hikes').insert([{ user_id: userId, hike_id }]);
        return res.json({ success: true, saved: true, message: 'Hike saved to your profile.' });
      }
    }

    const result = mockDataService.toggleSavedHike(userId, hike_id);
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  toggleSaveHike
};
