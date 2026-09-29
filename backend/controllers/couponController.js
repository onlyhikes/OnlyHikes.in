// ====================================================================
// ONLYHIKES.IN — COUPON CONTROLLER
// Strict server-side discount evaluation
// ====================================================================

const mockStore = require('../services/mockDataService');
const { validateAndCalculateCoupon } = require('../utils/couponValidator');
const { supabaseAdmin, isConfigured } = require('../services/supabaseService');

/**
 * Validate coupon code and calculate exact discount
 */
async function validateCoupon(req, res, next) {
  try {
    const { code, originalAmount, hikeId } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
    }

    const orderAmount = Number(originalAmount) || 0;
    let coupon = null;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .ilike('code', code.trim())
        .single();
      if (!error && data) coupon = data;
    } else {
      coupon = mockStore.getCouponByCode(code);
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid coupon code. Try ONLYHIKES50 for ₹50 off.'
      });
    }

    const calculation = validateAndCalculateCoupon(coupon, orderAmount, hikeId);

    if (!calculation.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: calculation.message
      });
    }

    return res.json({
      success: true,
      data: calculation
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get all coupons
 */
async function getAllCoupons(req, res, next) {
  try {
    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data });
    }

    return res.json({ success: true, data: mockStore.getCoupons() });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create coupon
 */
async function createCoupon(req, res, next) {
  try {
    const {
      code,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      expiry_date,
      max_uses,
      applicable_hikes
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount_type, and discount_value are required.'
      });
    }

    const newCoupon = {
      id: `cpn-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value: Number(discount_value),
      min_order_amount: Number(min_order_amount) || 0,
      max_discount_amount: max_discount_amount ? Number(max_discount_amount) : null,
      expiry_date: expiry_date || null,
      max_uses: max_uses ? Number(max_uses) : null,
      uses_count: 0,
      applicable_hikes: applicable_hikes || [],
      is_active: true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('coupons').insert(newCoupon).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockStore.coupons.unshift(newCoupon);
    return res.status(201).json({ success: true, data: newCoupon });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon
};
