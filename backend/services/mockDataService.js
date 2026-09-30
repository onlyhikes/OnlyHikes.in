// ====================================================================
// ONLYHIKES.IN — HIGH-FIDELITY IN-MEMORY PRODUCTION CMS DATA STORE
// Used seamlessly whenever Supabase credentials are not populated
// Pure real-data architecture: No fake bookings, no fake reviews, no referrals, no difficulty
// ====================================================================

const initialBrandSettings = {
  id: 'b0000000-0000-0000-0000-000000000001',
  brand_name: 'OnlyHikes',
  logo_url: '/logo.svg',
  favicon_url: '/favicon.ico',
  primary_color: '#CCFF00',
  secondary_color: '#FF5500',
  accent_color: '#CCFF00',
  whatsapp_community_url: 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
  instagram_url: 'https://www.instagram.com/onlyhikes.in/',
  default_og_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  updated_at: new Date().toISOString()
};

const initialSiteContent = {
  hero: {
    badge: "JAIPUR'S STUDENT ADVENTURE COMMUNITY",
    headline_line1: "YOUR WEEKEND",
    headline_line2: "JUST GOT WILDER.",
    subtitle: "Don't spend your weekend indoors. Go explore.",
    description: "Discover curated Aravali trails, secret fort viewpoints, fresh morning chai, and unforgettable weekends with college squads from across Jaipur.",
    primary_cta_text: "EXPLORE UPCOMING HIKES →",
    primary_cta_link: "/hikes",
    secondary_cta_text: "JOIN WHATSAPP TRIBE",
    secondary_cta_link: "https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27",
    background_media_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    background_media_type: "image",
    overlay_opacity: 75
  },
  why_jaipur: {
    badge: "THE ARAVALI CAPITAL",
    title: "WHY EXPLORE JAIPUR'S OUTDOORS?",
    subtitle: "Behind the pink stone facades lies India's oldest geological mountain range.",
    paragraphs: [
      "Most students spend four years in Jaipur seeing only mall corridors, coaching lanes, and crowded cafes. But right behind the city skyline rise the Aravali ridges — rugged, ancient, and breathtaking at sunrise.",
      "From secret step-trails behind Charan Mandir to misty canyon passes around Hathni Kund and quiet medieval ruins hidden in Alwar valley, Jaipur has some of North India's best accessible trekking terrain.",
      "You don't need a week of vacation or an expensive flight to Himachal. A wild weekend adventure is waiting just 30 minutes from your college campus."
    ],
    highlights: [
      { title: "Ancient Aravali Ridges", desc: "Billions of years old trails overlooking the Pink City panorama." },
      { title: "Dramatic Sunrises", desc: "Watch the golden sun crest over historic battlements before the city wakes." },
      { title: "Hidden Canyons & Stepwells", desc: "Canyon passes, natural water pools, and tucked-away ruins." }
    ]
  },
  why_adventure: {
    badge: "THE STUDENT RESET",
    title: "WHY CHOOSE ADVENTURE?",
    subtitle: "Trade screen fatigue and boring hostel routines for fresh Aravali ridge air.",
    points: [
      {
        number: "01",
        title: "Break The Monotony",
        desc: "Step outside your 10x10 hostel room. Push your physical limits and start Sunday with a surge of genuine dopamine."
      },
      {
        number: "02",
        title: "Real Connections",
        desc: "Hike with college students from MNIT, Manipal, Amity, JECRC, Poornima, and RU. Real conversations, zero pretension."
      },
      {
        number: "03",
        title: "Unfiltered Memories",
        desc: "Golden morning light on your face, shared ginger chai at the summit, and trail stories you'll talk about all semester."
      },
      {
        number: "04",
        title: "Affordable Freedom",
        desc: "Adventure designed specifically on a student budget. AC travel, safety marshals, food and logistics all sorted under ₹300."
      }
    ]
  },
  why_onlyhikes: {
    badge: "OUR MISSION",
    title: "NOT A TRAVEL AGENCY. A COMMUNITY.",
    subtitle: "Built specifically for Jaipur's youth and college adventurers.",
    manifesto: "Traditional travel agencies treat you like a tourist with megaphones and commercial commissions. OnlyHikes was founded by students who wanted something real: curated weekend trails, verified trek coordinators your own age, AC coach pickup from central hubs, hot breakfast, and an environment with strictly zero alcohol or commercial nonsense.",
    pillars: [
      { title: "Zero Pretense", desc: "Just raw trails, good people, and wild mornings." },
      { title: "All-Inclusive Logistics", desc: "Bus pickup, drops, food, hydration, and first-aid all handled." },
      { title: "Certified Coordinators", desc: "Trained trek marshals on every batch ensuring zero hiker gets left behind." }
    ]
  },
  how_it_works: {
    badge: "SIMPLE PROCESS",
    title: "HOW IT WORKS",
    subtitle: "4 simple steps to your wildest weekend reset.",
    steps: [
      {
        step: "01",
        title: "CHOOSE YOUR TRAIL",
        desc: "Browse our curated weekend hikes. Check the route, timings, photos, and live available seats."
      },
      {
        step: "02",
        title: "BOOK YOUR PASS",
        desc: "Select your seats, choose your nearest Jaipur pickup spot, apply your student promo code, and secure your ticket."
      },
      {
        step: "03",
        title: "WE PICK YOU UP",
        desc: "Hop onto our comfortable AC bus at WTP Malviya Nagar or Mansarovar early Sunday morning. Meet your coordinators."
      },
      {
        step: "04",
        title: "HIKE, EAT & CONNECT",
        desc: "Conquer the ridge trail, enjoy hot breakfast & ginger chai at the peak, take epic photos, and return refreshed by noon."
      }
    ]
  },
  announcements: {
    is_active: true,
    message: "🔥 Sunday Nahargarh Sunrise batch is live! AC bus pickup from WTP & Mansarovar. Limited seats remaining.",
    link_text: "Book Pass →",
    link_url: "/hikes"
  },
  footer: {
    tagline: "YOUR WEEKEND JUST GOT WILDER.",
    bio: "Jaipur's premier student outdoor adventure community. We organize weekend Aravali treks, sunrise runs, AC bus pickup & drops, fresh food, and community memories for college students across Jaipur.",
    support_email: "hello@onlyhikes.in",
    support_phone: "+91 98765 43210",
    instagram_url: "https://www.instagram.com/onlyhikes.in/",
    whatsapp_url: "https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27"
  }
};

const initialHikes = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'nahargarh-sunrise-hike',
    title: 'NAHARGARH SUNRISE HIKE',
    subtitle: 'Catch Jaipur waking up from the Aravali ridges before the city starts buzzing.',
    poster_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
    ],
    date: '2026-10-04',
    time: 'Sunday · 5:30 AM',
    selling_price: 299.00,
    original_price: 499.00,
    total_seats: 30,
    booked_seats: 0,
    description: 'Start your Sunday with adrenaline instead of a hangover. We hike the secret step-trail behind Charan Mandir up to the highest ridgeline of Nahargarh. Watch golden light flood over the Pink City, enjoy hot chai and fresh breakfast with 25+ other young adventurers, and make memories that will make your classmates jealous.',
    included_services: [
      'AC Bus Pickup & Drop',
      'Guided Ridge Trail',
      'Hot Poha & Ginger Chai',
      'Mineral Water Refills',
      '2 Certified Trek Coordinators',
      'First-Aid Support'
    ],
    food_info: 'Hot freshly cooked Poha with sev, bananas, and piping hot ginger-cardamom chai served at the summit.',
    water_info: 'Unlimited mineral water refills provided throughout the trek.',
    coordinators_info: '2 Certified Trek Coordinators accompanying every student batch.',
    things_to_carry: [
      'Sturdy Running/Hiking Shoes',
      'Valid College ID',
      '1L Reusable Water Bottle',
      'Small Daypack',
      'Light Jacket / Windcheater'
    ],
    safety_rules: [
      'Stay in single file on rocky ridges',
      'Strictly no stepping on unstable parapets',
      'Follow hike coordinator instructions',
      'Zero alcohol or substance tolerance'
    ],
    featured: true,
    background_media_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1920&q=80',
    background_media_type: 'image',
    primary_accent: '#CCFF00',
    secondary_accent: '#FF7326',
    overlay_intensity: 'dark',
    is_published: true
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    slug: 'bhangarh-midnight-expedition',
    title: 'BHANGARH MIDNIGHT RUINS & STARGAZING',
    subtitle: 'Venture into the legendary Aravali ghost valley under a canopy of stars.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ],
    date: '2026-10-10',
    time: 'Saturday · 9:00 PM',
    selling_price: 599.00,
    original_price: 899.00,
    total_seats: 25,
    booked_seats: 0,
    description: 'The ultimate night adventure for thrill-seekers. We board our AC coach in Jaipur at midnight, journey through Aravali gorges to the outer perimeter of Bhangarh, stargaze under unpolluted night skies, and witness dawn break over the 17th-century ramparts.',
    included_services: [
      'AC Coach Jaipur to Alwar & Back',
      'Guided Valley Night Trail',
      'Midnight Sandwiches & Hot Coffee',
      'Morning Breakfast',
      'Safety Escort & Stargazing'
    ],
    food_info: 'Midnight coffee and cheese sandwiches during stargazing, followed by morning parathas on the return.',
    water_info: 'Packaged mineral water bottles distributed for night trek and morning return.',
    coordinators_info: '3 Coordinators including certified night navigators and female coordinator escort.',
    things_to_carry: [
      'Sturdy Shoes',
      'Power Bank & Phone Torch',
      'Warm Hoodie / Jacket',
      'College ID Card'
    ],
    safety_rules: [
      'Stay strictly in the group corridor',
      'No wandering into unlit dry wells',
      'Listen to night marshal whistles',
      'Strictly zero substance tolerance'
    ],
    featured: true,
    background_media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    background_media_type: 'image',
    primary_accent: '#38BDF8',
    secondary_accent: '#818CF8',
    overlay_intensity: 'high_contrast',
    is_published: true
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'hathni-kund-waterfall-trail',
    title: 'HATHNI KUND CANYON TRAIL',
    subtitle: 'Traverse Jaipur’s lush monsoon valley with hidden gorges and ancient stepwells.',
    poster_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    date: '2026-10-18',
    time: 'Sunday · 6:00 AM',
    selling_price: 349.00,
    original_price: 549.00,
    total_seats: 30,
    booked_seats: 0,
    description: 'A rugged boulder and canyon trail through the Garh Ganesh valley up to Hathni Kund. Green canopy trails, natural seasonal waterfalls, stepwells, and ancient water reservoirs tucked away inside the dense northern Aravali fold.',
    included_services: [
      'AC Bus Pickup & Drop',
      'Guided Canyon Trail',
      'Fresh Samosas & Masala Chai',
      'Hydration Stations',
      'Certified Trek Marshals'
    ],
    food_info: 'Warm breakfast with crispy samosas, bananas, and cardamom masala chai.',
    water_info: 'Hydration refills at Base Camp and halfway mark.',
    coordinators_info: '2 certified wilderness coordinators.',
    things_to_carry: [
      'Grippy Running Shoes',
      'Extra Pair of Socks',
      'Rain Jacket',
      'College ID',
      '1L Water Bottle'
    ],
    safety_rules: [
      'Avoid mossy slippery boulders',
      'Single file along the canyon creek',
      'Keep all electronic gadgets waterproofed'
    ],
    featured: false,
    background_media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    background_media_type: 'image',
    primary_accent: '#34D399',
    secondary_accent: '#059669',
    overlay_intensity: 'dark',
    is_published: true
  }
];

const initialWaypoints = [
  { id: 'w1', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'Pickup Points (WTP & Mansarovar)', description: 'AC bus boarding at central Jaipur student hubs.', icon: 'bus', sort_order: 1, estimated_duration: '25 mins', is_published: true },
  { id: 'w2', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'Base Trailhead: Charan Mandir', description: 'Briefing by coordinators, stretching & hydration.', icon: 'footprints', sort_order: 2, estimated_duration: '15 mins', is_published: true },
  { id: 'w3', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'The Aravali Ridge Trail', description: 'Scenic ascent along stone steps & mountain spine.', icon: 'mountain', sort_order: 3, estimated_duration: '40 mins', is_published: true },
  { id: 'w4', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'Nahargarh Summit & Sunrise', description: '360° panoramic sunrise view over the Pink City.', icon: 'sun', sort_order: 4, estimated_duration: '35 mins', is_published: true },
  { id: 'w5', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'Hot Breakfast & Ginger Chai', description: 'Fresh poha & steaming chai at the ridge summit.', icon: 'coffee', sort_order: 5, estimated_duration: '30 mins', is_published: true },
  { id: 'w6', hike_id: 'a1111111-1111-1111-1111-111111111111', title: 'Return Drop to Campus Hubs', description: 'Descent and comfortable AC coach drop back by 10:30 AM.', icon: 'flag', sort_order: 6, estimated_duration: '30 mins', is_published: true }
];

const initialPickups = [
  { id: 'p1111111-1111-1111-1111-111111111111', title: 'WTP / Gaurav Tower', landmark: 'Main Gate, JLN Marg, Malviya Nagar', pickup_time: '04:45 AM', is_active: true },
  { id: 'p2222222-2222-2222-2222-222222222222', 'title': 'Mansarovar Metro Station', landmark: 'Pillar No. 24, Near Ticket Counter', pickup_time: '05:05 AM', is_active: true },
  { id: 'p3333333-3333-3333-3333-333333333333', title: 'Rambagh Circle / SMS Stadium', landmark: 'North Gate Bus Bay, Tonk Road', pickup_time: '05:20 AM', is_active: true }
];

const initialCoupons = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    code: 'ONLYHIKES50',
    discount_type: 'fixed',
    discount_value: 50.00,
    max_discount: 50.00,
    min_order_amount: 200.00,
    max_uses: 1000,
    current_uses: 0,
    is_active: true
  }
];

const initialMediaLibrary = [
  {
    id: 'm1',
    title: 'Nahargarh Dawn Poster',
    file_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    file_type: 'poster',
    file_size: 450000,
    placement: 'homepage_hero',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm2',
    title: 'Bhangarh Night Trek Reel Cover',
    file_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    file_type: 'reel',
    file_size: 320000,
    placement: 'trek_detail',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const initialExploreCategories = [
  { id: 'e1', name: 'Forts & Ridges', slug: 'forts-ridges', description: 'Ancient Aravali bastions with panoramic views.', icon: 'castle', sort_order: 1 },
  { id: 'e2', name: 'Sunrise & Sunset Points', slug: 'sunrise-sunset', description: 'Best dawn & dusk horizons in Jaipur.', icon: 'sun', sort_order: 2 },
  { id: 'e3', name: 'Hidden Gorges & Valleys', slug: 'hidden-valleys', description: 'Canyons, stepwells & water reservoirs.', icon: 'compass', sort_order: 3 }
];

const initialExploreItems = [
  {
    id: 'item1',
    category_id: 'e1',
    category: 'Forts & Ridges',
    title: 'Nahargarh Charan Mandir Trail',
    description: 'Secret step ascent up the Aravali spine overlooking Jaipur.',
    image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    location: 'Behind Charan Mandir',
    best_time: '5:15 AM - 7:30 AM',
    is_published: true
  },
  {
    id: 'item2',
    category_id: 'e2',
    category: 'Sunrise & Sunset Points',
    title: 'Galta Ji Sun Temple Ridge',
    description: 'Watch sunrise flood the entire Pink City valley from ancient temples.',
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    location: 'Galta Gate, East Jaipur',
    best_time: '5:45 AM - 7:00 AM',
    is_published: true
  },
  {
    id: 'item3',
    category_id: 'e3',
    category: 'Hidden Gorges & Valleys',
    title: 'Hathni Kund Hidden Canyon',
    description: 'Secluded canyon gorge tucked behind Garh Ganesh hill.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    location: 'Near Garh Ganesh, Amber Road',
    best_time: '6:00 AM - 9:00 AM',
    is_published: true
  }
];

class MockDataService {
  constructor() {
    this.brandSettings = { ...initialBrandSettings };
    this.siteContent = { ...initialSiteContent };
    this.hikes = [...initialHikes];
    this.waypoints = [...initialWaypoints];
    this.pickups = [...initialPickups];
    this.coupons = [...initialCoupons];
    this.mediaLibrary = [...initialMediaLibrary];
    this.exploreCategories = [...initialExploreCategories];
    this.exploreItems = [...initialExploreItems];
    this.bookings = []; // Strictly real bookings only!
    this.reviews = []; // Real approved reviews only!
    this.savedHikes = []; // User saved hikes
    this.users = []; // Real registered students only
  }

  // --- Brand Settings ---
  getBrandSettings() {
    return this.brandSettings;
  }

  updateBrandSettings(updates) {
    this.brandSettings = {
      ...this.brandSettings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.brandSettings;
  }

  // --- Site Content CMS ---
  getSiteContent(sectionKey) {
    if (sectionKey) {
      return this.siteContent[sectionKey] || null;
    }
    return this.siteContent;
  }

  updateSiteContent(sectionKey, content) {
    this.siteContent[sectionKey] = {
      ...this.siteContent[sectionKey],
      ...content
    };
    return this.siteContent[sectionKey];
  }

  // --- Media Library ---
  getMedia(placement) {
    if (placement) {
      return this.mediaLibrary.filter(m => m.placement === placement && m.is_active);
    }
    return this.mediaLibrary;
  }

  addMedia(mediaItem) {
    const newItem = {
      id: `media_${Date.now()}`,
      created_at: new Date().toISOString(),
      is_active: true,
      placement: 'unassigned',
      ...mediaItem
    };
    this.mediaLibrary.unshift(newItem);
    return newItem;
  }

  deleteMedia(id) {
    const idx = this.mediaLibrary.findIndex(m => m.id === id);
    if (idx !== -1) {
      const deleted = this.mediaLibrary.splice(idx, 1)[0];
      return deleted;
    }
    return null;
  }

  // --- Hikes Management ---
  getHikes({ publishedOnly = true, featuredOnly = false } = {}) {
    return this.hikes.filter(h => {
      if (publishedOnly && !h.is_published) return false;
      if (featuredOnly && !h.featured) return false;
      return true;
    });
  }

  getHikeBySlug(slug) {
    return this.hikes.find(h => h.slug === slug || h.id === slug) || null;
  }

  getHikeById(id) {
    return this.hikes.find(h => h.id === id) || null;
  }

  createHike(hikeData) {
    const newHike = {
      id: `hike_${Date.now()}`,
      slug: hikeData.slug || hikeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      booked_seats: 0,
      is_published: hikeData.is_published !== undefined ? hikeData.is_published : true,
      created_at: new Date().toISOString(),
      ...hikeData
    };
    this.hikes.push(newHike);
    return newHike;
  }

  updateHike(id, updates) {
    const idx = this.hikes.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.hikes[idx] = { ...this.hikes[idx], ...updates, updated_at: new Date().toISOString() };
      return this.hikes[idx];
    }
    return null;
  }

  deleteHike(id) {
    const idx = this.hikes.findIndex(h => h.id === id);
    if (idx !== -1) {
      const deleted = this.hikes.splice(idx, 1)[0];
      this.waypoints = this.waypoints.filter(w => w.hike_id !== id);
      return deleted;
    }
    return null;
  }

  duplicateHike(id) {
    const hike = this.getHikeById(id);
    if (!hike) return null;
    const duplicated = {
      ...hike,
      id: `hike_${Date.now()}`,
      slug: `${hike.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${hike.title} (Copy)`,
      booked_seats: 0,
      is_published: false,
      created_at: new Date().toISOString()
    };
    this.hikes.push(duplicated);
    return duplicated;
  }

  // --- Route Waypoints ---
  getWaypoints(hikeId) {
    return this.waypoints
      .filter(w => w.hike_id === hikeId && w.is_published)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  getAllWaypoints(hikeId) {
    return this.waypoints
      .filter(w => w.hike_id === hikeId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  createWaypoint(data) {
    const wp = {
      id: `wp_${Date.now()}`,
      is_published: true,
      sort_order: this.waypoints.filter(w => w.hike_id === data.hike_id).length + 1,
      ...data
    };
    this.waypoints.push(wp);
    return wp;
  }

  updateWaypoint(id, updates) {
    const idx = this.waypoints.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.waypoints[idx] = { ...this.waypoints[idx], ...updates };
      return this.waypoints[idx];
    }
    return null;
  }

  deleteWaypoint(id) {
    const idx = this.waypoints.findIndex(w => w.id === id);
    if (idx !== -1) {
      return this.waypoints.splice(idx, 1)[0];
    }
    return null;
  }

  // --- Pickups ---
  getPickups({ activeOnly = true } = {}) {
    return this.pickups.filter(p => !activeOnly || p.is_active);
  }

  createPickup(data) {
    const pickup = {
      id: `pickup_${Date.now()}`,
      is_active: true,
      ...data
    };
    this.pickups.push(pickup);
    return pickup;
  }

  updatePickup(id, updates) {
    const idx = this.pickups.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.pickups[idx] = { ...this.pickups[idx], ...updates };
      return this.pickups[idx];
    }
    return null;
  }

  // Get real booking counts per pickup
  getPickupManifest() {
    return this.pickups.map(p => {
      const assignedBookings = this.bookings.filter(b => b.pickup_location_id === p.id);
      const totalStudents = assignedBookings.reduce((sum, b) => sum + (b.seats_count || 1), 0);
      return {
        ...p,
        total_students: totalStudents,
        bookings_count: assignedBookings.length,
        bookings: assignedBookings
      };
    });
  }

  // --- Coupons ---
  getCoupons() {
    return this.coupons;
  }

  getCouponByCode(code) {
    if (!code) return null;
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active) || null;
  }

  createCoupon(data) {
    const coupon = {
      id: `coupon_${Date.now()}`,
      code: data.code.toUpperCase(),
      current_uses: 0,
      is_active: true,
      ...data
    };
    this.coupons.push(coupon);
    return coupon;
  }

  updateCoupon(id, updates) {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.coupons[idx] = { ...this.coupons[idx], ...updates };
      return this.coupons[idx];
    }
    return null;
  }

  // --- Bookings ---
  getBookings({ hikeId, paymentStatus, search } = {}) {
    return this.bookings.filter(b => {
      if (hikeId && b.hike_id !== hikeId) return false;
      if (paymentStatus && b.payment_status !== paymentStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches = (
          b.student_name?.toLowerCase().includes(q) ||
          b.student_email?.toLowerCase().includes(q) ||
          b.student_phone?.includes(q) ||
          b.booking_ref?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }
      return true;
    });
  }

  getBookingById(id) {
    return this.bookings.find(b => b.id === id || b.booking_ref === id) || null;
  }

  createBooking(bookingPayload) {
    const hike = this.getHikeById(bookingPayload.hike_id);
    if (!hike) {
      throw new Error('Trek not found.');
    }

    const availableSeats = hike.total_seats - (hike.booked_seats || 0);
    if (bookingPayload.seats_count > availableSeats) {
      throw new Error(`Only ${availableSeats} seat(s) remaining for this trek.`);
    }

    const bookingRef = `OH-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = {
      id: `bk_${Date.now()}`,
      booking_ref: bookingRef,
      created_at: new Date().toISOString(),
      payment_status: 'pending',
      hike_title: hike.title,
      hike_date: hike.date,
      hike_time: hike.time,
      hike_poster: hike.poster_url,
      ...bookingPayload
    };

    // Increment booked seats on the hike
    hike.booked_seats = (hike.booked_seats || 0) + bookingPayload.seats_count;

    this.bookings.unshift(newBooking);
    return newBooking;
  }

  updateBookingPayment(id, { payment_status, payment_id }) {
    const b = this.getBookingById(id);
    if (b) {
      b.payment_status = payment_status;
      if (payment_id) b.payment_id = payment_id;
      b.updated_at = new Date().toISOString();
      return b;
    }
    return null;
  }

  // --- Real Reviews Moderation ---
  getReviews({ approvedOnly = true } = {}) {
    return this.reviews.filter(r => !approvedOnly || r.is_approved);
  }

  addReview(reviewData) {
    const rev = {
      id: `rev_${Date.now()}`,
      created_at: new Date().toISOString(),
      is_approved: false, // requires admin approval
      ...reviewData
    };
    this.reviews.unshift(rev);
    return rev;
  }

  moderateReview(id, is_approved) {
    const rev = this.reviews.find(r => r.id === id);
    if (rev) {
      rev.is_approved = is_approved;
      return rev;
    }
    return null;
  }

  // --- Saved Hikes ---
  getSavedHikes(userId) {
    const hikeIds = this.savedHikes.filter(s => s.user_id === userId).map(s => s.hike_id);
    return this.hikes.filter(h => hikeIds.includes(h.id));
  }

  toggleSavedHike(userId, hikeId) {
    const idx = this.savedHikes.findIndex(s => s.user_id === userId && s.hike_id === hikeId);
    if (idx !== -1) {
      this.savedHikes.splice(idx, 1);
      return { saved: false };
    } else {
      this.savedHikes.push({ id: `save_${Date.now()}`, user_id: userId, hike_id: hikeId, created_at: new Date().toISOString() });
      return { saved: true };
    }
  }

  // --- Real Admin Overview Metrics (Zero Fake Stats) ---
  getAdminOverview() {
    const upcomingHikes = this.hikes.filter(h => h.is_published && new Date(h.date) >= new Date()).length;
    const totalBookings = this.bookings.length;
    const paidBookings = this.bookings.filter(b => b.payment_status === 'paid');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const activeCoupons = this.coupons.filter(c => c.is_active).length;
    const totalUsers = this.users.length;

    return {
      upcoming_hikes: upcomingHikes,
      total_bookings: totalBookings,
      paid_bookings_count: paidBookings.length,
      total_revenue: totalRevenue,
      active_coupons: activeCoupons,
      total_users: totalUsers,
      recent_bookings: this.bookings.slice(0, 5)
    };
  }

  // --- Explore ---
  getExploreCategories() {
    return this.exploreCategories;
  }

  getExploreItems(categoryId) {
    if (categoryId) {
      return this.exploreItems.filter(i => (i.category_id === categoryId || i.category === categoryId) && i.is_published);
    }
    return this.exploreItems.filter(i => i.is_published);
  }
}

const mockDataService = new MockDataService();

module.exports = {
  mockDataService,
  MockDataService
};
