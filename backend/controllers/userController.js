// ====================================================================
// ONLYHIKES.IN — USER & STUDENT PROFILE CONTROLLER
// Handles student portal, referral "Give ₹50. Get ₹50.", and saved trails
// ====================================================================

const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get student profile with bookings, referrals, and rewards
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user ? req.user.id : 'user-sample-01';

    let userBookings = [];
    let profileData = null;

    if (isConfigured && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
      profileData = profile;

      const { data: bData } = await supabaseAdmin.from('bookings').select('*, hikes(*)').eq('user_id', userId);
      userBookings = bData || [];
    } else {
      profileData = mockStore.getUsers().find(u => u.id === userId) || mockStore.getUsers()[0];
      userBookings = mockStore.bookings.filter(b => b.user_id === userId);
    }

    return res.json({
      success: true,
      data: {
        profile: profileData || {
          id: userId,
          full_name: 'Jaipur Adventurer',
          email: 'student@onlyhikes.in',
          phone: '+91 98290 12345',
          college: 'MNIT Jaipur',
          city: 'Jaipur',
          referral_code: 'EXPLORE50',
          referral_count: 2,
          rewards_earned: 100
        },
        bookings: userBookings,
        referral_stats: {
          code: profileData?.referral_code || 'EXPLORE50',
          offer: 'Give ₹50. Get ₹50.',
          successful_referrals: profileData?.referral_count || 2,
          rewards_earned: profileData?.rewards_earned || 100,
          pending_payouts: 0
        }
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
    const userId = req.user ? req.user.id : 'user-sample-01';
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

    const u = mockStore.users.find(x => x.id === userId);
    if (u) {
      Object.assign(u, { full_name, phone, college, city });
      return res.json({ success: true, data: u });
    }

    return res.json({ success: true, data: { id: userId, full_name, phone, college, city } });
  } catch (err) {
    next(err);
  }
}

/**
 * Explore Jaipur list
 */
function getExploreItems(req, res) {
  const items = mockStore.getExploreItems();
  return res.json({ success: true, data: items });
}

/**
 * Student Reviews list
 */
function getReviews(req, res) {
  const reviews = mockStore.getReviews();
  return res.json({ success: true, data: reviews });
}

module.exports = {
  getProfile,
  updateProfile,
  getExploreItems,
  getReviews
};
