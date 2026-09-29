// ====================================================================
// ONLYHIKES.IN — PAYMENT CONTROLLER
// Strict gateway configuration check and verification
// ====================================================================

const paymentGateway = require('../services/paymentGatewayService');
const mockStore = require('../services/mockDataService');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Get payment gateway status & public key if configured
 */
function getGatewayStatus(req, res) {
  const config = paymentGateway.getConfig();
  return res.json({
    success: true,
    data: config
  });
}

/**
 * Initiate payment order for a booking
 */
async function createPaymentOrder(req, res, next) {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ success: false, message: 'Booking ID is required.' });
    }

    // 1. Fetch Booking
    let booking = null;
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('bookings').select('*').eq('id', booking_id).single();
      if (error || !data) return res.status(404).json({ success: false, message: 'Booking not found.' });
      booking = data;
    } else {
      booking = mockStore.getBookingById(booking_id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // 2. Check if already paid
    if (booking.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid and confirmed.'
      });
    }

    // 3. Create Gateway Order
    const orderResult = await paymentGateway.createOrder({
      bookingId: booking.booking_ref || booking.id,
      amount: booking.total_amount,
      customerEmail: booking.student_email,
      customerPhone: booking.student_phone
    });

    if (!orderResult.success) {
      // Return the exact error required: "Payment gateway is not configured yet."
      return res.status(503).json({
        success: false,
        configured: false,
        payment_status: 'pending',
        message: orderResult.message,
        details: 'To process real payments, add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env',
        requiredEnv: orderResult.requiredEnv
      });
    }

    // If sandbox simulation is explicitly enabled, return order for testing
    return res.json({
      success: true,
      data: orderResult
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Verify payment signature & update booking to paid
 */
async function verifyPayment(req, res, next) {
  try {
    const { booking_id, order_id, payment_id, signature } = req.body;

    if (!booking_id || !payment_id) {
      return res.status(400).json({ success: false, message: 'Booking ID and Payment ID are required.' });
    }

    const verification = paymentGateway.verifyPaymentSignature({
      orderId: order_id,
      paymentId: payment_id,
      signature
    });

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: verification.message || 'Payment signature verification failed. Booking not confirmed.'
      });
    }

    // Update booking to paid
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_id: payment_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking_id)
        .select()
        .single();

      if (error) throw error;
      return res.json({
        success: true,
        message: 'Payment verified successfully! Booking confirmed.',
        data
      });
    }

    const updated = mockStore.updateBookingStatus(booking_id, 'paid', payment_id);
    return res.json({
      success: true,
      message: 'Payment verified successfully! Booking confirmed.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGatewayStatus,
  createPaymentOrder,
  verifyPayment
};
