const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('onlyhikes_token') : null;
  const adminKey = typeof window !== 'undefined' ? localStorage.getItem('onlyhikes_admin_key') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(adminKey && { 'x-admin-key': adminKey }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, ...data };
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      ok: false,
      status: 500,
      success: false,
      message: error.message || 'Network error connecting to OnlyHikes backend.'
    };
  }
}

// Hike endpoints
export const getHikes = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/hikes${query ? `?${query}` : ''}`);
};

export const getHikeDetails = (id) => fetchApi(`/hikes/${id}`);
export const createHike = (payload) => fetchApi('/hikes', { method: 'POST', body: JSON.stringify(payload) });
export const updateHike = (id, payload) => fetchApi(`/hikes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteHike = (id) => fetchApi(`/hikes/${id}`, { method: 'DELETE' });

// Booking endpoints
export const createBooking = (payload) => fetchApi('/bookings', { method: 'POST', body: JSON.stringify(payload) });
export const getBookingDetails = (id) => fetchApi(`/bookings/${id}`);
export const getAllBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/bookings${query ? `?${query}` : ''}`);
};

// Coupon endpoints
export const validateCoupon = (code, originalAmount, hikeId) => 
  fetchApi('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, originalAmount, hikeId })
  });

export const getAllCoupons = () => fetchApi('/coupons');
export const createCoupon = (payload) => fetchApi('/coupons', { method: 'POST', body: JSON.stringify(payload) });

// Voting endpoints
export const getActiveVotingRound = () => fetchApi('/votes/active');
export const castVote = (roundId, optionId) => 
  fetchApi('/votes/cast', {
    method: 'POST',
    body: JSON.stringify({ round_id: roundId, option_id: optionId })
  });

// Pickups endpoints
export const getPickups = (hikeId) => fetchApi(`/pickups${hikeId ? `?hike_id=${hikeId}` : ''}`);
export const getPickupManifest = () => fetchApi('/pickups/manifest');
export const createPickup = (payload) => fetchApi('/pickups', { method: 'POST', body: JSON.stringify(payload) });

// Payment endpoints
export const getPaymentConfig = () => fetchApi('/payments/config');
export const createPaymentOrder = (bookingId) => 
  fetchApi('/payments/orders', {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId })
  });
export const verifyPayment = (payload) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(payload) });

// User endpoints
export const getUserProfile = () => fetchApi('/users/profile');
export const updateUserProfile = (payload) => fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const getExploreJaipur = () => fetchApi('/users/explore');
export const getReviews = () => fetchApi('/users/reviews');

// Admin endpoints
export const getAdminOverview = () => fetchApi('/admin/overview');
