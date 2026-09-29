// ====================================================================
// ONLYHIKES.IN — ADMIN DASHBOARD CONTROLLER
// Aggregates overview KPIs, bus manifests, and CSV export
// ====================================================================

const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get overview KPIs for admin dashboard
 */
async function getOverview(req, res, next) {
  try {
    let hikesCount = 0;
    let bookingsCount = 0;
    let usersCount = 0;
    let totalRevenue = 0;
    let activeCouponsCount = 0;
    let votingParticipation = 0;

    if (isConfigured && supabaseAdmin) {
      const { count: hCount } = await supabaseAdmin.from('hikes').select('*', { count: 'exact', head: true });
      const { data: bData } = await supabaseAdmin.from('bookings').select('total_amount, payment_status');
      const { count: uCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
      const { count: cCount } = await supabaseAdmin.from('coupons').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: vCount } = await supabaseAdmin.from('votes').select('*', { count: 'exact', head: true });

      hikesCount = hCount || 0;
      usersCount = uCount || 0;
      activeCouponsCount = cCount || 0;
      votingParticipation = vCount || 0;

      if (bData) {
        bookingsCount = bData.length;
        totalRevenue = bData
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
      }
    } else {
      hikesCount = mockStore.getHikes().length;
      bookingsCount = mockStore.bookings.length;
      usersCount = mockStore.getUsers().length;
      activeCouponsCount = mockStore.getCoupons().filter(c => c.is_active).length;
      
      const round = mockStore.getActiveVotingRound();
      votingParticipation = round?.options.reduce((sum, o) => sum + o.votes_count, 0) || 0;

      totalRevenue = mockStore.bookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    }

    return res.json({
      success: true,
      data: {
        upcoming_hikes: hikesCount,
        total_bookings: bookingsCount,
        total_users: usersCount,
        total_revenue: totalRevenue,
        active_coupons: activeCouponsCount,
        voting_participation: votingParticipation,
        currency: 'INR'
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Export Bookings as CSV for bus conductors & coordinators
 */
async function exportBookingsCsv(req, res, next) {
  try {
    let bookings = [];

    if (isConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('bookings')
        .select('booking_ref, student_name, student_email, student_phone, student_college, seats_count, pickup_title, total_amount, payment_status, created_at')
        .order('created_at', { ascending: false });
      bookings = data || [];
    } else {
      bookings = mockStore.bookings;
    }

    const headers = [
      'Booking Ref',
      'Student Name',
      'Email',
      'Phone',
      'College',
      'Seats',
      'Pickup Location',
      'Amount (INR)',
      'Payment Status',
      'Booked Date'
    ];

    const rows = bookings.map(b => [
      `"${b.booking_ref || ''}"`,
      `"${b.student_name || ''}"`,
      `"${b.student_email || ''}"`,
      `"${b.student_phone || ''}"`,
      `"${b.student_college || ''}"`,
      b.seats_count || 1,
      `"${b.pickup_title || b.pickup_location_id || 'WTP'}"`,
      b.total_amount || 0,
      `"${b.payment_status || 'pending'}"`,
      `"${b.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="OnlyHikes_Manifest.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOverview,
  exportBookingsCsv
};
