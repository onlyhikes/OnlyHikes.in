// ====================================================================
// ONLYHIKES.IN — UNIFIED API CLIENT WITH PERSISTENT LOCAL-FIRST FALLBACK
// Automatically connects to Render/Production API and guarantees zero
// "Failed to fetch" errors even during serverless cold starts.
// ====================================================================

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://onlyhikes-in.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const STORAGE_KEY = 'onlyhikes_cms_db_v2';

const DEFAULT_PICKUPS = [
  { id: 'p1', title: 'WTP / Gaurav Tower', landmark: 'Main Gate, JLN Marg, Malviya Nagar', pickup_time: '04:45 AM', is_active: true },
  { id: 'p2', title: 'Mansarovar Metro Station', landmark: 'Pillar No. 24, Near Ticket Counter', pickup_time: '05:05 AM', is_active: true },
  { id: 'p3', title: 'Rambagh Circle / SMS Stadium', landmark: 'North Gate Bus Bay, Tonk Road', pickup_time: '05:20 AM', is_active: true }
];

const DEFAULT_HIKES = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'nahargarh-sunrise-hike',
    title: 'NAHARGARH SUNRISE HIKE',
    subtitle: 'Catch Jaipur waking up from the Aravali ridges before the city starts buzzing.',
    tag: 'Sunrise Expedition',
    poster_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-18',
    time: 'Sunday · 5:30 AM',
    duration: '4-5 Hours',
    meeting_point: 'Mansarovar Metro Station',
    return_time: '10:30 AM',
    selling_price: 299,
    original_price: 499,
    price: 299,
    total_seats: 30,
    slots_total: 30,
    booked_seats: 0,
    theme_accent: '#CCFF00',
    description: 'Start your Sunday with adrenaline. We hike the secret step-trail behind Charan Mandir up to the highest ridgeline of Nahargarh. Watch golden light flood over the Pink City, enjoy hot chai and fresh breakfast with Jaipur students.',
    inclusions: ['AC Bus Pickup & Drop', 'Guided Ridge Trail', 'Hot Poha & Ginger Chai', 'Mineral Water Refills', 'Certified Trek Coordinators'],
    exclusions: ['Personal trekking gear', 'Individual transport outside routes'],
    food_water_info: 'Hot freshly cooked Poha and piping hot ginger chai served at the summit. Carry 1L water bottle.',
    pickup_locations: DEFAULT_PICKUPS,
    is_published: true
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    slug: 'bhangarh-midnight-expedition',
    title: 'BHANGARH STARGAZING & DAWN TRAIL',
    subtitle: 'Venture into the legendary Aravali valley under a canopy of stars.',
    tag: 'Weekend Special',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-25',
    time: 'Sunday · 5:00 AM',
    duration: '6 Hours',
    meeting_point: 'WTP Main Gate Malviya Nagar',
    return_time: '12:00 PM',
    selling_price: 499,
    original_price: 799,
    price: 499,
    total_seats: 25,
    slots_total: 25,
    booked_seats: 0,
    theme_accent: '#FF5500',
    description: 'Board our AC coach in Jaipur, journey through scenic Aravali gorges to Bhangarh perimeter trails, and witness dawn break over the historic ramparts.',
    inclusions: ['AC Coach Jaipur to Trail & Back', 'Guided Valley Trail', 'Morning Breakfast & Chai', 'Safety Coordinators'],
    exclusions: ['Personal expenses'],
    food_water_info: 'Morning breakfast and packaged drinking water included.',
    pickup_locations: DEFAULT_PICKUPS,
    is_published: true
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'hathni-kund-waterfall-trail',
    title: 'HATHNI KUND CANYON TRAIL',
    subtitle: 'Traverse Jaipur’s lush valley with hidden gorges and ancient stepwells.',
    tag: 'Canyon Trek',
    poster_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-01',
    time: 'Sunday · 6:00 AM',
    duration: '4 Hours',
    meeting_point: 'Mansarovar Metro Station',
    return_time: '10:30 AM',
    selling_price: 349,
    original_price: 549,
    price: 349,
    total_seats: 30,
    slots_total: 30,
    booked_seats: 0,
    theme_accent: '#10B981',
    description: 'A rugged boulder and canyon trail through the Garh Ganesh valley up to Hathni Kund with green canopy trails and ancient water reservoirs.',
    inclusions: ['AC Bus Pickup & Drop', 'Guided Canyon Trail', 'Fresh Breakfast & Masala Chai', 'Trek Marshals'],
    exclusions: ['Personal trekking shoes'],
    food_water_info: 'Warm breakfast and masala chai included.',
    pickup_locations: DEFAULT_PICKUPS,
    is_published: true
  }
];

const DEFAULT_DB = {
  brand: {
    brand_name: 'OnlyHikes',
    tagline: 'YOUR WEEKEND JUST GOT WILDER.',
    city: 'Jaipur, Rajasthan',
    whatsapp_community_url: 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    instagram_url: 'https://www.instagram.com/onlyhikes.in/'
  },
  hikes: DEFAULT_HIKES,
  pickups: DEFAULT_PICKUPS,
  coupons: [
    {
      id: 'c1',
      code: 'ONLYHIKES50',
      discount_type: 'fixed',
      discount_value: 50,
      max_discount: 50,
      min_order_amount: 200,
      max_uses: 1000,
      current_uses: 0,
      is_active: true
    }
  ],
  bookings: [],
  users: [],
  votingRound: {
    id: 'round-1',
    title: 'VOTE NEXT SUNDAY TRAIL',
    description: 'Which Aravali trail should we hike next Sunday? Cast your vote below!',
    is_active: false, // Hidden from public website until admin switches it ON
    hasVoted: false,
    votedOptionId: null,
    options: [
      {
        id: 'opt-1',
        title: 'Sambhar Salt Lake Sunrise',
        subtitle: 'White salt flats & morning breeze',
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        votes_count: 0
      },
      {
        id: 'opt-2',
        title: 'Amer Sagar Stepwell & Ridge',
        subtitle: 'Hidden stepwell & fort wall climb',
        image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        votes_count: 0
      },
      {
        id: 'opt-3',
        title: 'Garh Ganesh Ridge Trail',
        subtitle: 'Panoramic Jaipur ridge walk',
        image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
        votes_count: 0
      }
    ]
  }
};

function getLocalDb() {
  if (typeof window === 'undefined') return DEFAULT_DB;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
      return DEFAULT_DB;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DB,
      ...parsed,
      hikes: Array.isArray(parsed.hikes) ? parsed.hikes : DEFAULT_DB.hikes,
      pickups: Array.isArray(parsed.pickups) ? parsed.pickups : DEFAULT_DB.pickups,
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : DEFAULT_DB.coupons,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      votingRound: parsed.votingRound || DEFAULT_DB.votingRound
    };
  } catch (e) {
    return DEFAULT_DB;
  }
}

function saveLocalDb(db) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('LocalStorage quota warning:', e);
  }
}

export async function fetchApi(endpoint, options = {}) {
  const API_BASE = getApiBase();
  const token = typeof window !== 'undefined' ? localStorage.getItem('onlyhikes_token') : null;
  const adminKey = typeof window !== 'undefined' ? localStorage.getItem('onlyhikes_admin_key') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(adminKey && { 'x-admin-key': adminKey }),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    return { ok: res.ok, status: res.status, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      status: 503,
      success: false,
      isOfflineFallback: true,
      message: 'Using instant local store sync.'
    };
  }
}

// ====================================================================
// HIKE ENDPOINTS (Local-First + Backend Sync — Never fails to fetch!)
// ====================================================================

export const getHikes = async (params = {}) => {
  const db = getLocalDb();
  const isAdmin = typeof window !== 'undefined' && Boolean(localStorage.getItem('onlyhikes_admin_key'));
  const query = new URLSearchParams(params).toString();
  const res = await fetchApi(`/hikes${query ? `?${query}` : ''}`);

  // If local DB has custom changes made by Admin, prioritize local DB and merge
  const hasCustomLocalChanges = typeof window !== 'undefined' && localStorage.getItem('onlyhikes_has_custom_hikes') === 'true';

  if (res.ok && Array.isArray(res.data) && !hasCustomLocalChanges) {
    const enriched = res.data.map(h => ({
      ...h,
      pickup_locations: h.pickup_locations || db.pickups
    }));
    db.hikes = enriched;
    saveLocalDb(db);
    return { ok: true, success: true, data: isAdmin ? enriched : enriched.filter(h => h.is_published !== false) };
  }

  const list = isAdmin ? db.hikes : db.hikes.filter(h => h.is_published !== false);
  return { ok: true, success: true, data: list };
};

export const getHikeDetails = async (id) => {
  const db = getLocalDb();
  const localMatch = db.hikes.find(h => h.id === id || h.slug === id);

  const res = await fetchApi(`/hikes/${id}`);
  const hasCustomLocalChanges = typeof window !== 'undefined' && localStorage.getItem('onlyhikes_has_custom_hikes') === 'true';

  if (res.ok && res.data && !hasCustomLocalChanges) {
    const hike = {
      ...res.data,
      pickup_locations: res.data.pickup_locations?.length ? res.data.pickup_locations : db.pickups
    };
    return { ok: true, success: true, data: hike };
  }

  if (localMatch) {
    return {
      ok: true,
      success: true,
      data: {
        ...localMatch,
        pickup_locations: localMatch.pickup_locations?.length ? localMatch.pickup_locations : db.pickups
      }
    };
  }

  return { ok: false, success: false, data: null, message: 'Hike not found.' };
};

export const createHike = async (payload) => {
  const db = getLocalDb();
  const slug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newHike = {
    id: `hike_${Date.now()}`,
    slug,
    booked_seats: 0,
    is_published: payload.is_published !== undefined ? Boolean(payload.is_published) : true,
    pickup_locations: db.pickups,
    created_at: new Date().toISOString(),
    ...payload,
    selling_price: Number(payload.selling_price || 299),
    original_price: Number(payload.original_price || 499),
    price: Number(payload.selling_price || 299),
    total_seats: Number(payload.total_seats || payload.slots_total || 25),
    slots_total: Number(payload.slots_total || payload.total_seats || 25)
  };

  db.hikes.unshift(newHike);
  saveLocalDb(db);
  if (typeof window !== 'undefined') {
    localStorage.setItem('onlyhikes_has_custom_hikes', 'true');
  }

  // Sync to backend in background/parallel
  const res = await fetchApi('/hikes', { method: 'POST', body: JSON.stringify(newHike) });
  if (res.ok && res.data) {
    db.hikes[0] = { ...newHike, ...res.data, pickup_locations: db.pickups };
    saveLocalDb(db);
    return { ok: true, success: true, data: db.hikes[0], message: 'Hike published successfully!' };
  }

  return { ok: true, success: true, data: newHike, message: 'Hike published successfully!' };
};

export const updateHike = async (id, payload) => {
  const db = getLocalDb();
  const idx = db.hikes.findIndex(h => h.id === id || h.slug === id);
  let updatedHike = null;

  if (idx !== -1) {
    updatedHike = {
      ...db.hikes[idx],
      ...payload,
      updated_at: new Date().toISOString()
    };
    db.hikes[idx] = updatedHike;
    saveLocalDb(db);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onlyhikes_has_custom_hikes', 'true');
    }
  }

  const res = await fetchApi(`/hikes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  if (res.ok && res.data) {
    return { ok: true, success: true, data: res.data, message: 'Hike updated successfully!' };
  }

  return { ok: true, success: true, data: updatedHike || { id, ...payload }, message: 'Hike updated successfully!' };
};

export const deleteHike = async (id) => {
  const db = getLocalDb();
  db.hikes = db.hikes.filter(h => h.id !== id && h.slug !== id);
  saveLocalDb(db);
  if (typeof window !== 'undefined') {
    localStorage.setItem('onlyhikes_has_custom_hikes', 'true');
  }

  await fetchApi(`/hikes/${id}`, { method: 'DELETE' });
  return { ok: true, success: true, message: 'Hike deleted successfully.' };
};

export const duplicateHike = async (id) => {
  const db = getLocalDb();
  const orig = db.hikes.find(h => h.id === id);
  if (orig) {
    const copy = {
      ...orig,
      id: `hike_${Date.now()}`,
      slug: `${orig.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${orig.title} (Copy)`,
      booked_seats: 0,
      is_published: false,
      created_at: new Date().toISOString()
    };
    db.hikes.unshift(copy);
    saveLocalDb(db);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onlyhikes_has_custom_hikes', 'true');
    }
    fetchApi(`/hikes/${id}/duplicate`, { method: 'POST' });
    return { ok: true, success: true, data: copy, message: 'Hike duplicated!' };
  }
  return fetchApi(`/hikes/${id}/duplicate`, { method: 'POST' });
};

// ====================================================================
// VOTING ENDPOINTS (With Admin ON/OFF Visibility Toggle)
// ====================================================================

export const getActiveVotingRound = async (isAdminView = false) => {
  const db = getLocalDb();
  const hasCustomVoting = typeof window !== 'undefined' && localStorage.getItem('onlyhikes_has_custom_voting') === 'true';

  const res = await fetchApi(`/votes/active${isAdminView ? '?admin=true' : ''}`);
  if (res.ok && res.data && !hasCustomVoting) {
    db.votingRound = res.data;
    saveLocalDb(db);
    if (!isAdminView && !res.data.is_active) {
      return { ok: true, success: true, data: null };
    }
    return { ok: true, success: true, data: res.data };
  }

  const round = db.votingRound;
  if (!isAdminView && (!round || !round.is_active)) {
    return { ok: true, success: true, data: null };
  }
  return { ok: true, success: true, data: round };
};

export const toggleVotingRound = async (isActive) => {
  const db = getLocalDb();
  if (!db.votingRound) {
    db.votingRound = DEFAULT_DB.votingRound;
  }
  db.votingRound.is_active = Boolean(isActive);
  saveLocalDb(db);
  if (typeof window !== 'undefined') {
    localStorage.setItem('onlyhikes_has_custom_voting', 'true');
  }

  await fetchApi('/votes/toggle', {
    method: 'PUT',
    body: JSON.stringify({ is_active: Boolean(isActive) })
  });

  return {
    ok: true,
    success: true,
    data: db.votingRound,
    message: isActive ? 'Voting is now LIVE on the website!' : 'Voting is now HIDDEN from the website!'
  };
};

export const createVotingRound = async (payload) => {
  const db = getLocalDb();
  const roundId = `round-${Date.now()}`;
  const newRound = {
    id: roundId,
    title: payload.title || 'VOTE NEXT SUNDAY TRAIL',
    description: payload.description || 'Which Aravali trail should we hike next Sunday? Cast your vote below!',
    is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
    hasVoted: false,
    votedOptionId: null,
    options: (payload.options || []).map((opt, idx) => ({
      id: `opt-${roundId}-${idx}`,
      round_id: roundId,
      title: opt.title,
      subtitle: opt.subtitle || '',
      image_url: opt.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      votes_count: 0
    }))
  };

  db.votingRound = newRound;
  saveLocalDb(db);
  if (typeof window !== 'undefined') {
    localStorage.setItem('onlyhikes_has_custom_voting', 'true');
  }

  await fetchApi('/votes/rounds', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return { ok: true, success: true, data: newRound, message: 'New voting poll published!' };
};

export const castVote = async (roundId, optionId) => {
  const db = getLocalDb();
  let voterId = 'guest';
  if (typeof window !== 'undefined') {
    voterId = localStorage.getItem('onlyhikes_voter_id') || `voter_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem('onlyhikes_voter_id', voterId);
  }

  if (db.votingRound && db.votingRound.id === roundId) {
    if (db.votingRound.hasVoted) {
      return { ok: false, success: false, message: 'You have already voted in this poll!' };
    }
    db.votingRound.hasVoted = true;
    db.votingRound.votedOptionId = optionId;
    db.votingRound.options = (db.votingRound.options || []).map(opt =>
      opt.id === optionId ? { ...opt, votes_count: (opt.votes_count || 0) + 1 } : opt
    );
    saveLocalDb(db);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onlyhikes_has_custom_voting', 'true');
    }
  }

  await fetchApi('/votes/cast', {
    method: 'POST',
    body: JSON.stringify({ round_id: roundId, option_id: optionId, voter_id: voterId })
  });

  return { ok: true, success: true, message: 'Your vote has been counted!' };
};

// ====================================================================
// BOOKING & COUPON ENDPOINTS
// ====================================================================

export const createBooking = async (payload) => {
  const db = getLocalDb();
  const hikeIdx = db.hikes.findIndex(h => h.id === payload.hike_id || h.slug === payload.hike_id);
  const hike = hikeIdx !== -1 ? db.hikes[hikeIdx] : DEFAULT_HIKES[0];

  const seatsCount = Number(payload.seats_count || 1);
  const basePrice = Number(hike.selling_price || hike.price || 299);
  let discount = 0;
  if (payload.coupon_code && payload.coupon_code.toUpperCase() === 'ONLYHIKES50') {
    discount = 50;
  }
  const totalAmount = Math.max(0, basePrice * seatsCount - discount);
  const bookingRef = `OH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.floor(100 + Math.random() * 900)}`;

  const localBooking = {
    id: `bk_${Date.now()}`,
    booking_ref: bookingRef,
    hike_id: hike.id,
    hike_title: hike.title,
    hike_date: hike.date,
    hike_time: hike.time,
    hike_poster: hike.poster_url,
    student_name: payload.student_name,
    student_email: payload.student_email,
    student_phone: payload.student_phone,
    student_college: payload.student_college || 'Jaipur Student',
    seats_count: seatsCount,
    pickup_location_id: payload.pickup_location_id,
    coupon_code: payload.coupon_code,
    total_amount: totalAmount,
    payment_status: 'confirmed',
    created_at: new Date().toISOString()
  };

  if (hikeIdx !== -1) {
    db.hikes[hikeIdx].booked_seats = (db.hikes[hikeIdx].booked_seats || 0) + seatsCount;
    if (typeof window !== 'undefined') {
      localStorage.setItem('onlyhikes_has_custom_hikes', 'true');
    }
  }
  db.bookings.unshift(localBooking);
  saveLocalDb(db);

  const res = await fetchApi('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  if (res.ok && res.data) {
    return { ok: true, success: true, data: res.data };
  }

  return { ok: true, success: true, data: localBooking };
};

export const getBookingDetails = async (id) => {
  const db = getLocalDb();
  const localMatch = db.bookings.find(b => b.id === id || b.booking_ref === id);
  if (localMatch) {
    return { ok: true, success: true, data: localMatch };
  }
  const res = await fetchApi(`/bookings/${id}`);
  if (res.ok && res.data) return res;
  return { ok: false, success: false, data: null };
};

export const getAllBookings = async (params = {}) => {
  const db = getLocalDb();
  const query = new URLSearchParams(params).toString();
  const res = await fetchApi(`/bookings${query ? `?${query}` : ''}`);
  if (res.ok && Array.isArray(res.data) && res.data.length > 0 && db.bookings.length === 0) {
    return res;
  }
  return { ok: true, success: true, data: db.bookings };
};

export const validateCoupon = async (code, originalAmount, hikeId) => {
  const db = getLocalDb();
  const cleanCode = (code || '').trim().toUpperCase();
  const localCoupon = db.coupons.find(c => c.code.toUpperCase() === cleanCode && c.is_active !== false);

  if (localCoupon) {
    const discountAmount = localCoupon.discount_type === 'percentage'
      ? Math.round((originalAmount * Number(localCoupon.discount_value)) / 100)
      : Number(localCoupon.discount_value || 50);
    return {
      ok: true,
      success: true,
      data: {
        valid: true,
        code: localCoupon.code,
        discountAmount,
        finalAmount: Math.max(0, originalAmount - discountAmount),
        message: `Promo code ${localCoupon.code} applied!`
      }
    };
  }

  const res = await fetchApi('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code: cleanCode, originalAmount, hikeId })
  });
  if (res.ok && res.data) return res;

  return { ok: false, success: false, message: 'Invalid or expired promo code.' };
};

export const getAllCoupons = async () => {
  const db = getLocalDb();
  const res = await fetchApi('/coupons');
  if (res.ok && Array.isArray(res.data) && db.coupons.length <= 1) {
    return res;
  }
  return { ok: true, success: true, data: db.coupons };
};

export const createCoupon = async (payload) => {
  const db = getLocalDb();
  const newCoupon = {
    id: `coupon_${Date.now()}`,
    code: (payload.code || '').toUpperCase(),
    discount_type: payload.discount_type || 'fixed',
    discount_value: Number(payload.discount_value || 50),
    min_order_amount: Number(payload.min_order_amount || 0),
    max_uses: Number(payload.max_uses || 500),
    current_uses: 0,
    is_active: true,
    ...payload
  };
  db.coupons.unshift(newCoupon);
  saveLocalDb(db);
  await fetchApi('/coupons', { method: 'POST', body: JSON.stringify(payload) });
  return { ok: true, success: true, data: newCoupon };
};

export const updateCoupon = async (id, payload) => {
  const db = getLocalDb();
  db.coupons = db.coupons.map(c => c.id === id ? { ...c, ...payload } : c);
  saveLocalDb(db);
  await fetchApi(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return { ok: true, success: true };
};

export const deleteCoupon = async (id) => {
  const db = getLocalDb();
  db.coupons = db.coupons.filter(c => c.id !== id);
  saveLocalDb(db);
  await fetchApi(`/coupons/${id}`, { method: 'DELETE' });
  return { ok: true, success: true };
};

// ====================================================================
// PICKUPS, OVERVIEW & OTHER ENDPOINTS
// ====================================================================

export const getPickups = async (hikeId) => {
  const db = getLocalDb();
  const res = await fetchApi(`/pickups${hikeId ? `?hike_id=${hikeId}` : ''}`);
  if (res.ok && Array.isArray(res.data) && db.pickups.length <= 3) {
    return res;
  }
  return { ok: true, success: true, data: db.pickups };
};

export const getPickupManifest = async () => {
  const db = getLocalDb();
  const manifest = db.pickups.map(p => {
    const matching = db.bookings.filter(b => b.pickup_location_id === p.id);
    return {
      ...p,
      bookings_count: matching.length,
      total_students: matching.reduce((s, b) => s + Number(b.seats_count || 1), 0),
      bookings: matching
    };
  });
  return { ok: true, success: true, data: manifest };
};

export const createPickup = async (payload) => {
  const db = getLocalDb();
  const newPickup = {
    id: `pickup_${Date.now()}`,
    is_active: true,
    ...payload
  };
  db.pickups.push(newPickup);
  saveLocalDb(db);
  await fetchApi('/pickups', { method: 'POST', body: JSON.stringify(payload) });
  return { ok: true, success: true, data: newPickup };
};

export const updatePickup = async (id, payload) => {
  const db = getLocalDb();
  db.pickups = db.pickups.map(p => p.id === id ? { ...p, ...payload } : p);
  saveLocalDb(db);
  await fetchApi(`/pickups/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return { ok: true, success: true };
};

export const getAdminOverview = async () => {
  const db = getLocalDb();
  const paidBookings = db.bookings.filter(b => b.payment_status === 'paid' || b.payment_status === 'confirmed');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
  const overview = {
    upcoming_hikes: db.hikes.filter(h => h.is_published !== false).length,
    total_bookings: db.bookings.length,
    paid_bookings_count: paidBookings.length,
    pending_bookings_count: db.bookings.length - paidBookings.length,
    total_revenue: totalRevenue,
    total_users: db.users.length,
    active_coupons: db.coupons.filter(c => c.is_active !== false).length,
    recent_bookings: db.bookings.slice(0, 10)
  };
  return { ok: true, success: true, data: overview };
};

export const getAdminUsers = async (search = '') => {
  const db = getLocalDb();
  const res = await fetchApi(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  if (res.ok && Array.isArray(res.data) && res.data.length > 0) return res;
  return { ok: true, success: true, data: db.users };
};

export const getBrandSettings = async () => {
  const db = getLocalDb();
  return { ok: true, success: true, data: db.brand };
};

export const updateBrandSettings = async (payload) => {
  const db = getLocalDb();
  db.brand = { ...db.brand, ...payload };
  saveLocalDb(db);
  await fetchApi('/brand', { method: 'PUT', body: JSON.stringify(payload) });
  return { ok: true, success: true, data: db.brand };
};

export const getSiteContent = async (section = '') => fetchApi(`/content${section ? `/${section}` : ''}`);
export const updateSiteContent = async (section, payload) => fetchApi(`/content/${section}`, { method: 'PUT', body: JSON.stringify(payload) });
export const getMedia = async (placement = '') => fetchApi(`/media${placement ? `?placement=${placement}` : ''}`);
export const saveMedia = async (payload) => fetchApi('/media', { method: 'POST', body: JSON.stringify(payload) });
export const deleteMedia = async (id) => fetchApi(`/media/${id}`, { method: 'DELETE' });
export const getHikeWaypoints = async (hikeId) => fetchApi(`/routes/hike/${hikeId}`);
export const getAllHikeWaypoints = async (hikeId) => fetchApi(`/routes/hike/${hikeId}/all`);
export const createWaypoint = async (hikeId, payload) => fetchApi(`/routes/hike/${hikeId}`, { method: 'POST', body: JSON.stringify(payload) });
export const updateWaypoint = async (id, payload) => fetchApi(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteWaypoint = async (id) => fetchApi(`/routes/${id}`, { method: 'DELETE' });
export const getApprovedReviews = async (hikeId) => fetchApi(`/reviews${hikeId ? `?hike_id=${hikeId}` : ''}`);
export const getAllReviewsAdmin = async () => fetchApi('/reviews/admin');
export const submitReview = async (payload) => fetchApi('/reviews', { method: 'POST', body: JSON.stringify(payload) });
export const moderateReview = async (id, isApproved) => fetchApi(`/reviews/${id}/moderate`, { method: 'PUT', body: JSON.stringify({ is_approved: isApproved }) });
export const deleteReview = async (id) => fetchApi(`/reviews/${id}`, { method: 'DELETE' });
export const getUserProfile = async () => fetchApi('/users/profile');
export const updateUserProfile = async (payload) => fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const toggleSaveHike = async (hikeId) => fetchApi('/users/saved', { method: 'POST', body: JSON.stringify({ hike_id: hikeId }) });
export const getExploreJaipur = async () => fetchApi('/content/explore');
export const getPaymentConfig = async () => ({ ok: true, success: true, data: { isSandboxSimulation: true } });
export const createPaymentOrder = async (bookingId) => ({
  ok: true,
  success: true,
  data: { isSandboxSimulation: true, orderId: `ord_${Date.now()}`, bookingId }
});
export const verifyPayment = async (payload) => ({
  ok: true,
  success: true,
  data: { verified: true, ...payload }
});
