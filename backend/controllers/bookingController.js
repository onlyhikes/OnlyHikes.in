// ====================================================================
// ONLYHIKES.IN — BOOKING CONTROLLER
// Strict seat availability and server-side pricing validation
// ====================================================================

const mockStore = require('../services/mockDataService');
const { validateSeatAvailability } = require('../utils/seatValidator');
const { validateAndCalculateCoupon } = require('../utils/couponValidator');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Create a new booking
 */
async function createBooking(req, res, next) {
  try {
    const {
      hike_id,
      student_name,
      student_email,
      student_phone,
      student_college,
      seats_count,
      pickup_location_id,
      coupon_code,
      notes
    } = req.body;

    if (!hike_id || !student_name || !student_email || !student_phone || !seats_count) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, hike selection, and number of seats are required.'
      });
    }

    const seats = parseInt(seats_count, 10);
    if (isNaN(seats) || seats < 1) {
      return res.status(400).json({ success: false, message: 'Please select at least 1 seat.' });
    }

    // 1. Fetch Hike & Validate Seats
    let hike = null;
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('hikes').select('*').eq('id', hike_id).single();
      if (error || !data) return res.status(404).json({ success: false, message: 'Hike not found.' });
      hike = data;
    } else {
      hike = mockStore.getHikeByIdOrSlug(hike_id);
      if (!hike) return res.status(404).json({ success: false, message: 'Hike not found.' });
    }

    const seatCheck = validateSeatAvailability(hike, seats);
    if (!seatCheck.available) {
      return res.status(400).json({ success: false, message: seatCheck.message });
    }

    // 2. Calculate Pricing Server-Side
    const originalAmount = hike.price * seats;
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon_code) {
      let couponData = null;
      if (isConfigured && supabaseAdmin) {
        const { data } = await supabaseAdmin
          .from('coupons')
          .select('*')
          .ilike('code', coupon_code.trim())
          .eq('is_active', true)
          .single();
        couponData = data;
      } else {
        couponData = mockStore.getCouponByCode(coupon_code);
      }

      if (couponData) {
        const couponResult = validateAndCalculateCoupon(couponData, originalAmount, hike.id);
        if (couponResult.valid) {
          discountAmount = couponResult.discountAmount;
          appliedCoupon = couponData;
        } else {
          return res.status(400).json({
            success: false,
            message: `Coupon error: ${couponResult.message}`
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code.'
        });
      }
    }

    const totalAmount = Math.max(0, originalAmount - discountAmount);

    // 3. Resolve Pickup Location title
    let pickupTitle = 'WTP / Malviya Nagar';
    let pickupTime = hike.time;
    if (pickup_location_id) {
      if (isConfigured && supabaseAdmin) {
        const { data: pData } = await supabaseAdmin.from('pickup_locations').select('*').eq('id', pickup_location_id).single();
        if (pData) {
          pickupTitle = `${pData.title} (${pData.landmark})`;
          pickupTime = pData.pickup_time;
        }
      } else {
        const pData = mockStore.getPickups(hike.id).find(p => p.id === pickup_location_id);
        if (pData) {
          pickupTitle = `${pData.title} (${pData.landmark})`;
          pickupTime = pData.pickup_time;
        }
      }
    }

    const bookingRef = `OH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingPayload = {
      booking_ref: bookingRef,
      hike_id: hike.id,
      user_id: req.user ? req.user.id : null,
      student_name,
      student_email,
      student_phone,
      student_college: student_college || 'Jaipur Student',
      seats_count: seats,
      pickup_location_id: pickup_location_id || null,
      pickup_title: pickupTitle,
      pickup_time: pickupTime,
      coupon_id: appliedCoupon ? appliedCoupon.id : null,
      original_amount: originalAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_status: 'pending', // Pending real gateway payment!
      payment_id: null,
      notes: notes || '',
      whatsapp_group_url: process.env.DEFAULT_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/demo-invite-jaipur-wild'
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('bookings').insert(bookingPayload).select().single();
      if (error) throw error;
      return res.status(201).json({
        success: true,
        data,
        message: 'Booking initiated. Proceed to payment.'
      });
    }

    // Local Store
    const savedBooking = mockStore.createBooking(bookingPayload);
    return res.status(201).json({
      success: true,
      data: savedBooking,
      message: 'Booking initiated. Proceed to payment.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get booking by ID or reference
 */
async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabaseAdmin.from('bookings').select('*, hikes(title, date, time, poster_url), pickup_locations(title, landmark, pickup_time)');
      query = isUUID ? query.eq('id', id) : query.eq('booking_ref', id);
      const { data, error } = await query.single();
      if (error || !data) return res.status(404).json({ success: false, message: 'Booking not found.' });
      return res.json({ success: true, data });
    }

    const booking = mockStore.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get all bookings with filtering & search
 */
async function getAllBookings(req, res, next) {
  try {
    const { hike_id, payment_status, search } = req.query;

    if (isConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('bookings').select('*, hikes(title, date, time)');
      if (hike_id) query = query.eq('hike_id', hike_id);
      if (payment_status) query = query.eq('payment_status', payment_status);
      if (search) query = query.ilike('student_name', `%${search}%`);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const bookings = mockStore.getBookings({ hike_id, payment_status, search });
    return res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings
};
