// ====================================================================
// ONLYHIKES.IN — COUPON CONTROLLER
// Strict server-side discount evaluation & Admin Management
// ====================================================================

const { mockDataService } = require('../services/mockDataService');
const { validateAndCalculateCoupon } = require('../utils/couponValidator');
const { supabase, supabaseAdmin, isConfigured } = require('../services/supabaseService');

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

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', code.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) coupon = data;
    } else {
      coupon = mockDataService.getCouponByCode(code);
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid or inactive promo code.'
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
      return res.json({ success: true, data: data || [] });
    }

    return res.json({ success: true, data: mockDataService.getCoupons() });
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
      max_discount,
      expires_at,
      max_uses,
      applicable_hike_id
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount_type, and discount_value are required.'
      });
    }

    const newCoupon = {
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value: Number(discount_value),
      min_order_amount: Number(min_order_amount) || 0,
      max_discount: max_discount ? Number(max_discount) : null,
      expires_at: expires_at || null,
      max_uses: max_uses ? Number(max_uses) : null,
      current_uses: 0,
      applicable_hike_id: applicable_hike_id || null,
      is_active: true
    };

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('coupons').insert([newCoupon]).select().single();
      if (error) throw error;
      mockDataService.createCoupon(data);
      return res.status(201).json({ success: true, data });
    }

    const created = mockDataService.createCoupon(newCoupon);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update coupon
 */
async function updateCoupon(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('coupons').update(updates).eq('id', id).select().single();
      if (error) throw error;
      mockDataService.updateCoupon(id, updates);
      return res.json({ success: true, data });
    }

    const updated = mockDataService.updateCoupon(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete coupon
 */
async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;

    if (isConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('coupons').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Coupon deleted.' });
    }

    const idx = mockDataService.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      mockDataService.coupons.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
