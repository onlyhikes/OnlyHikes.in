// ====================================================================
// ONLYHIKES.IN — HIGH-FIDELITY LOCAL IN-MEMORY DATA STORE
// Used seamlessly whenever Supabase credentials are not populated
// ====================================================================

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
    price: 299.00,
    total_seats: 25,
    booked_seats: 18,
    difficulty: 'Moderate',
    description: 'Start your Sunday with adrenaline instead of a hangover. We hike the secret step-trail behind Charan Mandir up to the highest ridgeline of Nahargarh. Watch golden light flood over the Pink City, enjoy hot chai and poha with 24 other young adventurers, and make memories that will make your classmates jealous.',
    included_services: [
      'AC Bus Pickup & Drop',
      'Guided Ridge Trail',
      'Hot Poha & Ginger Chai',
      'Mineral Water Refills',
      '2 Certified Trek Coordinators',
      'First-Aid & Safety Escort'
    ],
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
      'Follow hike marshal instructions',
      'Zero alcohol or substance tolerance'
    ],
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
    price: 599.00,
    total_seats: 30,
    booked_seats: 12,
    difficulty: 'Challenging',
    description: 'Known as India’s most haunted enclave, Bhangarh’s rugged outskirts offer world-class Aravali bouldering and zero-light pollution stargazing. Experience acoustic jam sessions by the campfire, night trail navigation with headlamps, and breakfast by the lakeside.',
    included_services: [
      'AC Traveller Pickup & Drop',
      'Campfire & Acoustic Session',
      'Midnight Snacks & Hot Maggi',
      'Headlamps & Glow Sticks',
      '3 Experienced Coordinators',
      'Telescope Stargazing Access'
    ],
    things_to_carry: [
      'Warm Layers / Hoodie',
      'Headlamp or Flashlight',
      'Power Bank',
      'Campus ID'
    ],
    safety_rules: [
      'Never wander alone off the trail',
      'Stay within whistle audible range',
      'Comply with local heritage authority boundaries'
    ],
    is_published: true
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'hathni-kund-waterfall-trail',
    title: 'HATHNI KUND FORGOTTEN VALLEY TREK',
    subtitle: 'Canyon descent into lush monsoon pools and prehistoric Aravali rock walls.',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    date: '2026-10-18',
    time: 'Sunday · 6:30 AM',
    price: 349.00,
    total_seats: 28,
    booked_seats: 7,
    difficulty: 'Moderate',
    description: 'A breathtaking descent into the hidden canyon of Hathni Kund. Scramble over granite boulders, cross freshwater springs, and discover a secluded temple buried deep within the forest. Includes breakfast sandwiches and energy drinks.',
    included_services: [
      'Tempo Traveller Pickup & Drop',
      'Canyon Route Guiding',
      'Healthy Sandwiches & Juice',
      'Electrolyte Hydration',
      'Professional Photography'
    ],
    things_to_carry: [
      'Shoes with Good Grip',
      'Quick-dry Clothes',
      'Waterproof Pouch for Phone'
    ],
    safety_rules: [
      'Check footing on wet rocks',
      'No diving into unverified pool depths'
    ],
    is_published: true
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    slug: 'chandlai-lake-sunset-ramble',
    title: 'CHANDLAI LAKE FLAMINGO WALK & SUNSET',
    subtitle: 'Scenic birdwatching ramble and sunset chill session on the lake dyke.',
    poster_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    date: '2026-10-24',
    time: 'Saturday · 3:30 PM',
    price: 249.00,
    total_seats: 35,
    booked_seats: 4,
    difficulty: 'Easy',
    description: 'Perfect for beginners and photography enthusiasts. Walk the ancient mud bund of Chandlai lake as thousands of migratory flamingos and waterfowl gather. Wrap up the hike watching the sun dip behind the Aravalis with fresh samosas and chai.',
    included_services: [
      'Bus Pickup & Drop',
      'Birdwatching Binoculars',
      'Evening Snacks & Tea',
      'Community Chill Circle'
    ],
    things_to_carry: [
      'Comfortable Walking Shoes',
      'Binoculars (optional)',
      'Sunglasses'
    ],
    safety_rules: [
      'Maintain silence near nesting colonies',
      'Stay on marked earthen embankment'
    ],
    is_published: true
  }
];

const initialPickups = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    title: 'WTP / Gaurav Tower',
    landmark: 'Opposite World Trade Park Main Gate, JLN Marg',
    pickup_time: '04:45 AM',
    map_url: 'https://maps.google.com/?q=WTP+Jaipur',
    capacity: 20,
    is_active: true
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Raja Park (LBS College Corner)',
    landmark: 'Near Saras Dairy Booth, Tilak Nagar Link',
    pickup_time: '05:00 AM',
    map_url: 'https://maps.google.com/?q=Raja+Park+Jaipur',
    capacity: 20,
    is_active: true
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Vaishali Nagar',
    landmark: 'Amrapali Circle Bus Stop',
    pickup_time: '04:30 AM',
    map_url: 'https://maps.google.com/?q=Amrapali+Circle+Jaipur',
    capacity: 20,
    is_active: true
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Mansarovar Metro Station',
    landmark: 'Gate No. 1 Auto Stand',
    pickup_time: '04:20 AM',
    map_url: 'https://maps.google.com/?q=Mansarovar+Metro+Jaipur',
    capacity: 20,
    is_active: true
  }
];

const initialCoupons = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    code: 'ONLYHIKES50',
    discount_type: 'fixed',
    discount_value: 50.00,
    min_order_amount: 299.00,
    max_discount_amount: 50.00,
    expiry_date: '2028-12-31T23:59:59Z',
    max_uses: 500,
    uses_count: 24,
    applicable_hikes: [],
    is_active: true
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    code: 'JAIPURSTUDENT',
    discount_type: 'percentage',
    discount_value: 15.00,
    min_order_amount: 299.00,
    max_discount_amount: 100.00,
    expiry_date: '2028-12-31T23:59:59Z',
    max_uses: 1000,
    uses_count: 58,
    applicable_hikes: [],
    is_active: true
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    code: 'SQUADUP',
    discount_type: 'fixed',
    discount_value: 150.00,
    min_order_amount: 800.00,
    max_discount_amount: 150.00,
    expiry_date: '2028-12-31T23:59:59Z',
    max_uses: 200,
    uses_count: 11,
    applicable_hikes: [],
    is_active: true
  }
];

const initialVotingRounds = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    title: 'WEEKEND #42: WHERE SHOULD WE GO NEXT?',
    description: 'Jaipur students decide the trail. The winning adventure will be scheduled for next weekend with exclusive student pricing.',
    start_date: '2026-09-25T00:00:00Z',
    end_date: '2026-10-05T23:59:59Z',
    is_active: true,
    options: [
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        title: 'Sambhar Salt Lake Camp & Stargazing',
        subtitle: 'White desert vibes, tent setup & milky way observation',
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Moderate',
        votes_count: 142
      },
      {
        id: 'd2222222-2222-2222-2222-222222222222',
        title: 'Amer Sagar Secret Stepwell Trail',
        subtitle: 'Forgotten 16th-century reservoir and forest ruins behind Amer',
        image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Easy',
        votes_count: 98
      },
      {
        id: 'd3333333-3333-3333-3333-333333333333',
        title: 'Garh Ganesh 365-Step Peak Scramble',
        subtitle: 'Ancient steep rock staircase overlooking the whole walled city',
        image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Challenging',
        votes_count: 114
      },
      {
        id: 'd4444444-4444-4444-4444-444444444444',
        title: 'Chour Ghati Hidden Valley Trek',
        subtitle: 'Monolith rock formations and quiet nature canyon near Galta',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        difficulty: 'Moderate',
        votes_count: 76
      }
    ]
  }
];

const initialExplore = [
  {
    id: 'exp-1',
    category: 'Hiking',
    title: 'Nahargarh Back-Ridge Trail',
    location: 'Charan Mandir Route',
    best_time: '5:00 AM - 7:30 AM',
    difficulty: 'Moderate',
    image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    description: 'The most popular trail among Jaipur college students. Passes through stone paths and thorn forest before climbing to the fort walls.',
    tips: 'Start before 5:30 AM to catch the dawn glow. Carry good grip sneakers.'
  },
  {
    id: 'exp-2',
    category: 'Forts',
    title: 'Jaigarh Secret Bastions',
    location: 'Amer Hills',
    best_time: '6:00 AM - 10:00 AM',
    difficulty: 'Easy',
    image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    description: 'The fortress of victory perched high above Amer Fort with expansive views over Maota Lake and Sagar reservoir.',
    tips: 'Look for the interconnected underground tunnel leading toward Amer.'
  },
  {
    id: 'exp-3',
    category: 'Sunrise',
    title: 'Garh Ganesh Sunrise Steps',
    location: 'Brahmapuri Ridge',
    best_time: '5:15 AM - 6:30 AM',
    difficulty: 'Challenging',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: '365 steep stone steps built directly into the cliff face leading to an ancient fortress temple with sweeping city panoramas.',
    tips: 'A great morning cardio blast. The temple does not allow phone photography inside.'
  },
  {
    id: 'exp-4',
    category: 'Sunset',
    title: 'Hathni Kund Sunset Perch',
    location: 'Nahargarh Foothills',
    best_time: '5:30 PM - 7:00 PM',
    difficulty: 'Moderate',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Catch the twilight sky turn purple over the Jaipur basin from this secluded boulder lookout.',
    tips: 'Bring a light jacket as winds pick up after dark.'
  },
  {
    id: 'exp-5',
    category: 'Nature',
    title: 'Chandlai Lake Wetland',
    location: 'Tonk Road (30km from Jaipur)',
    best_time: '4:00 PM - 6:30 PM',
    difficulty: 'Easy',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Pristine 100-year-old reservoir hosting thousands of migratory flamingos and pochards in the winter season.',
    tips: 'Carry binoculars and avoid bright synthetic clothing.'
  },
  {
    id: 'exp-6',
    category: 'Hidden Spots',
    title: 'Chour Ghati Forest Valley',
    location: 'Galta Gorge',
    best_time: '6:00 AM - 9:00 AM',
    difficulty: 'Moderate',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'A quiet valley between two towering Aravali spurs filled with natural stone caverns, peacocks, and desert flora.',
    tips: 'Best visited in groups of 4 or more. Avoid feeding the rhesus monkeys.'
  }
];

const initialReviews = [
  {
    id: 'rev-1',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    author_name: 'Aarav Sharma',
    author_college: 'MNIT Jaipur · CSE \'25',
    rating: 5,
    comment: 'Honestly thought I would regret waking up at 4:30 AM, but the sunrise from the ridge was pure magic. The bus pickup from WTP made everything super smooth. Meeting students from Manipal & JECRC was awesome!',
    is_verified: true,
    is_featured: true,
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'rev-2',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    author_name: 'Tanvi Mathur',
    author_college: 'Manipal University Jaipur · Design',
    rating: 5,
    comment: 'The coordinators were so supportive! I was nervous about the rocky path, but they helped everyone through. The hot chai and poha at the top tasted 10x better after that climb.',
    is_verified: true,
    is_featured: true,
    created_at: '2026-09-21T12:30:00Z'
  },
  {
    id: 'rev-3',
    hike_id: 'a2222222-2222-2222-2222-222222222222',
    author_name: 'Rohan Khandelwal',
    author_college: 'Rajasthan University · Commerce',
    rating: 5,
    comment: 'Bhangarh night trek was wild! Stargazing away from city lights with acoustic songs by the fire was the best weekend I have had in Jaipur so far. Highly recommend the squad discount!',
    is_verified: true,
    is_featured: true,
    created_at: '2026-09-22T08:15:00Z'
  }
];

const initialBookings = [
  {
    id: 'bk-demo-101',
    booking_ref: 'OH-2026-8921',
    hike_id: 'a1111111-1111-1111-1111-111111111111',
    hike_title: 'NAHARGARH SUNRISE HIKE',
    hike_date: 'Sunday, 4 October 2026',
    user_id: 'user-sample-01',
    student_name: 'Aarav Sharma',
    student_email: 'aarav.sharma@mnit.ac.in',
    student_phone: '+91 98290 12345',
    student_college: 'MNIT Jaipur',
    seats_count: 2,
    pickup_title: 'WTP / Gaurav Tower',
    pickup_time: '04:45 AM',
    original_amount: 598.00,
    discount_amount: 0.00,
    total_amount: 598.00,
    payment_status: 'paid',
    payment_id: 'pay_demo_test_101',
    created_at: '2026-09-24T14:20:00Z'
  }
];

class MockDataStore {
  constructor() {
    this.hikes = [...initialHikes];
    this.pickups = [...initialPickups];
    this.coupons = [...initialCoupons];
    this.votingRounds = JSON.parse(JSON.stringify(initialVotingRounds));
    this.userVotes = new Map(); // key: `${roundId}_${userId}`
    this.explore = [...initialExplore];
    this.reviews = [...initialReviews];
    this.bookings = [...initialBookings];
    this.users = [
      {
        id: 'user-sample-01',
        full_name: 'Aarav Sharma',
        email: 'aarav.sharma@mnit.ac.in',
        phone: '+91 98290 12345',
        college: 'MNIT Jaipur',
        city: 'Jaipur',
        referral_code: 'AARAV50',
        referral_count: 3,
        rewards_earned: 150
      },
      {
        id: 'user-sample-02',
        full_name: 'Tanvi Mathur',
        email: 'tanvi.m@jaipur.manipal.edu',
        phone: '+91 94140 54321',
        college: 'Manipal University Jaipur',
        city: 'Jaipur',
        referral_code: 'TANVI50',
        referral_count: 1,
        rewards_earned: 50
      }
    ];
  }

  getHikes() {
    return this.hikes;
  }

  getHikeByIdOrSlug(identifier) {
    return this.hikes.find(h => h.id === identifier || h.slug === identifier) || null;
  }

  addHike(hike) {
    this.hikes.unshift(hike);
    return hike;
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
      return this.hikes.splice(idx, 1)[0];
    }
    return null;
  }

  getPickups(hikeId) {
    if (!hikeId) return this.pickups;
    const hikeSpecific = this.pickups.filter(p => p.hike_id === hikeId);
    if (hikeSpecific.length > 0) return hikeSpecific;
    return this.pickups;
  }

  getCoupons() {
    return this.coupons;
  }

  getCouponByCode(code) {
    if (!code) return null;
    return this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active);
  }

  getActiveVotingRound() {
    return this.votingRounds.find(r => r.is_active) || this.votingRounds[0];
  }

  getAllVotingRounds() {
    return this.votingRounds;
  }

  castVote(roundId, optionId, userId) {
    const voteKey = `${roundId}_${userId}`;
    if (this.userVotes.has(voteKey)) {
      throw new Error('You have already voted in this round. Each student is allowed 1 vote.');
    }

    const round = this.votingRounds.find(r => r.id === roundId);
    if (!round) throw new Error('Voting round not found.');
    if (!round.is_active) throw new Error('This voting round has ended.');

    const option = round.options.find(o => o.id === optionId);
    if (!option) throw new Error('Selected destination option does not exist.');

    option.votes_count += 1;
    this.userVotes.set(voteKey, { optionId, votedAt: new Date().toISOString() });

    return { success: true, optionId, newVotesCount: option.votes_count };
  }

  hasUserVoted(roundId, userId) {
    return this.userVotes.has(`${roundId}_${userId}`);
  }

  getUserVotedOption(roundId, userId) {
    const record = this.userVotes.get(`${roundId}_${userId}`);
    return record ? record.optionId : null;
  }

  createBooking(bookingData) {
    const hike = this.getHikeByIdOrSlug(bookingData.hike_id);
    if (!hike) throw new Error('Hike not found');

    const availableSeats = hike.total_seats - hike.booked_seats;
    if (bookingData.seats_count > availableSeats) {
      throw new Error(`Only ${availableSeats} seats remaining for this hike. Cannot book ${bookingData.seats_count} seats.`);
    }

    // Allocate seats
    hike.booked_seats += bookingData.seats_count;

    const newBooking = {
      id: `bk-${Date.now()}`,
      booking_ref: `OH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData,
      hike_title: hike.title,
      hike_date: hike.time,
      created_at: new Date().toISOString()
    };

    this.bookings.unshift(newBooking);
    return newBooking;
  }

  getBookings(filter = {}) {
    let result = [...this.bookings];
    if (filter.hike_id) result = result.filter(b => b.hike_id === filter.hike_id);
    if (filter.payment_status) result = result.filter(b => b.payment_status === filter.payment_status);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(b => 
        b.student_name.toLowerCase().includes(q) || 
        b.student_email.toLowerCase().includes(q) || 
        b.booking_ref.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getBookingById(id) {
    return this.bookings.find(b => b.id === id || b.booking_ref === id) || null;
  }

  updateBookingStatus(id, status, paymentId = null) {
    const b = this.bookings.find(x => x.id === id || x.booking_ref === id);
    if (b) {
      b.payment_status = status;
      if (paymentId) b.payment_id = paymentId;
      return b;
    }
    return null;
  }

  getExploreItems() {
    return this.explore;
  }

  getReviews() {
    return this.reviews;
  }

  getUsers() {
    return this.users;
  }
}

const mockStore = new MockDataStore();

module.exports = mockStore;
