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

// Brand & Settings
export const getBrandSettings = () => fetchApi('/brand');
export const updateBrandSettings = (payload) => fetchApi('/brand', { method: 'PUT', body: JSON.stringify(payload) });

// Site Content CMS
export const getSiteContent = (section = '') => fetchApi(`/content${section ? `/${section}` : ''}`);
export const updateSiteContent = (section, payload) => fetchApi(`/content/${section}`, { method: 'PUT', body: JSON.stringify(payload) });

// Media Library
export const getMedia = (placement = '') => fetchApi(`/media${placement ? `?placement=${placement}` : ''}`);
export const saveMedia = (payload) => fetchApi('/media', { method: 'POST', body: JSON.stringify(payload) });
export const deleteMedia = (id) => fetchApi(`/media/${id}`, { method: 'DELETE' });

// Hike Endpoints
export const getHikes = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/hikes${query ? `?${query}` : ''}`);
};
export const getHikeDetails = (id) => fetchApi(`/hikes/${id}`);
export const createHike = (payload) => fetchApi('/hikes', { method: 'POST', body: JSON.stringify(payload) });
export const updateHike = (id, payload) => fetchApi(`/hikes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteHike = (id) => fetchApi(`/hikes/${id}`, { method: 'DELETE' });
export const duplicateHike = (id) => fetchApi(`/hikes/${id}/duplicate`, { method: 'POST' });

// Graphical Route Waypoints
export const getHikeWaypoints = (hikeId) => fetchApi(`/routes/hike/${hikeId}`);
export const getAllHikeWaypoints = (hikeId) => fetchApi(`/routes/hike/${hikeId}/all`);
export const createWaypoint = (hikeId, payload) => fetchApi(`/routes/hike/${hikeId}`, { method: 'POST', body: JSON.stringify(payload) });
export const updateWaypoint = (id, payload) => fetchApi(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteWaypoint = (id) => fetchApi(`/routes/${id}`, { method: 'DELETE' });

// Booking Endpoints
export const createBooking = (payload) => fetchApi('/bookings', { method: 'POST', body: JSON.stringify(payload) });
export const getBookingDetails = (id) => fetchApi(`/bookings/${id}`);
export const getAllBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/bookings${query ? `?${query}` : ''}`);
};

// Coupon Endpoints
export const validateCoupon = (code, originalAmount, hikeId) => 
  fetchApi('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, originalAmount, hikeId })
  });
export const getAllCoupons = () => fetchApi('/coupons');
export const createCoupon = (payload) => fetchApi('/coupons', { method: 'POST', body: JSON.stringify(payload) });
export const updateCoupon = (id, payload) => fetchApi(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteCoupon = (id) => fetchApi(`/coupons/${id}`, { method: 'DELETE' });

// Pickups Endpoints
export const getPickups = (hikeId) => fetchApi(`/pickups${hikeId ? `?hike_id=${hikeId}` : ''}`);
export const getPickupManifest = () => fetchApi('/pickups/manifest');
export const createPickup = (payload) => fetchApi('/pickups', { method: 'POST', body: JSON.stringify(payload) });
export const updatePickup = (id, payload) => fetchApi(`/pickups/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

// Reviews Endpoints
export const getApprovedReviews = (hikeId) => fetchApi(`/reviews${hikeId ? `?hike_id=${hikeId}` : ''}`);
export const getAllReviewsAdmin = () => fetchApi('/reviews/admin');
export const submitReview = (payload) => fetchApi('/reviews', { method: 'POST', body: JSON.stringify(payload) });
export const moderateReview = (id, isApproved) => fetchApi(`/reviews/${id}/moderate`, { method: 'PUT', body: JSON.stringify({ is_approved: isApproved }) });
export const deleteReview = (id) => fetchApi(`/reviews/${id}`, { method: 'DELETE' });

// User & Profile Endpoints
export const getUserProfile = () => fetchApi('/users/profile');
export const updateUserProfile = (payload) => fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const toggleSaveHike = (hikeId) => fetchApi('/users/saved', { method: 'POST', body: JSON.stringify({ hike_id: hikeId }) });

// Admin & Overview
export const getAdminOverview = () => fetchApi('/admin/overview');
export const getAdminUsers = (search = '') => fetchApi(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);

// Voting
export const getActiveVotingRound = () => fetchApi('/votes/active');
export const castVote = (roundId, optionId) => 
  fetchApi('/votes/cast', {
    method: 'POST',
    body: JSON.stringify({ round_id: roundId, option_id: optionId })
  });

// Explore Jaipur
export const getExploreJaipur = () => fetchApi('/content/explore');

// Payment Gateway Endpoints
export const getPaymentConfig = () => fetchApi('/payments/config');
export const createPaymentOrder = (bookingId) => 
  fetchApi('/payments/orders', {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId })
  });
export const verifyPayment = (payload) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(payload) });

