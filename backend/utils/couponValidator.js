// ====================================================================
// ONLYHIKES.IN — SERVER-SIDE COUPON VALIDATOR
// Ensures coupon business rules and discount calculation are strictly enforced
// ====================================================================

function validateAndCalculateCoupon(coupon, originalAmount, hikeId = null, userUsageCount = 0) {
  if (!coupon) {
    return {
      valid: false,
      message: 'Invalid coupon code.'
    };
  }

  if (!coupon.is_active) {
    return {
      valid: false,
      message: 'This coupon code is currently inactive.'
    };
  }

  // Check Expiration
  if (coupon.expiry_date) {
    const expiry = new Date(coupon.expiry_date);
    if (new Date() > expiry) {
      return {
        valid: false,
        message: 'This coupon code has expired.'
      };
    }
  }

  // Check Minimum Order Amount
  const minOrder = Number(coupon.min_order_amount) || 0;
  if (originalAmount < minOrder) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${minOrder} is required for this coupon.`
    };
  }

  // Check Maximum Total Uses
  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
    return {
      valid: false,
      message: 'This coupon has reached its maximum global usage limit.'
    };
  }

  // Check Per-User Usage Limit (default 1 use per student)
  if (userUsageCount > 0) {
    return {
      valid: false,
      message: 'You have already redeemed this coupon code.'
    };
  }

  // Check Hike Specificity
  if (hikeId && Array.isArray(coupon.applicable_hikes) && coupon.applicable_hikes.length > 0) {
    if (!coupon.applicable_hikes.includes(hikeId)) {
      return {
        valid: false,
        message: 'This coupon is not applicable to the selected hike.'
      };
    }
  }

  // Calculate Discount
  let discount = 0;
  const discountVal = Number(coupon.discount_value);

  if (coupon.discount_type === 'percentage') {
    discount = (originalAmount * discountVal) / 100;
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, Number(coupon.max_discount_amount));
    }
  } else if (coupon.discount_type === 'fixed') {
    discount = discountVal;
  }

  // Discount cannot exceed order total
  discount = Math.min(discount, originalAmount);
  discount = Math.round(discount * 100) / 100;

  const finalAmount = Math.max(0, originalAmount - discount);

  return {
    valid: true,
    code: coupon.code,
    couponId: coupon.id,
    discountType: coupon.discount_type,
    discountValue: discountVal,
    discountAmount: discount,
    originalAmount,
    finalAmount,
    message: `Coupon applied! Saved ₹${discount}`
  };
}

module.exports = {
  validateAndCalculateCoupon
};
