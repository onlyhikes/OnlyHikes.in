-- ====================================================================
-- ONLYHIKES.IN — SUPABASE SEED DATA: seed.sql
-- Curated Jaipur Student Adventure Seed
-- ====================================================================

-- 1. Insert Hikes
INSERT INTO public.hikes (
    id, slug, title, subtitle, poster_url, date, time, price, total_seats, booked_seats, difficulty, description, included_services, things_to_carry, safety_rules, is_published
) VALUES 
(
    'a1111111-1111-1111-1111-111111111111',
    'nahargarh-sunrise-hike',
    'NAHARGARH SUNRISE HIKE',
    'Catch Jaipur waking up from the Aravali ridges before the city starts buzzing.',
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '5 days',
    'Sunday · 5:30 AM',
    299.00,
    25,
    18,
    'Moderate',
    'Start your Sunday with adrenaline instead of a hangover. We hike the secret step-trail behind Charan Mandir up to the highest ridgeline of Nahargarh. Watch golden light flood over the Pink City, enjoy hot chai and poha with 24 other young adventurers, and make memories that will make your classmates jealous.',
    '["AC Bus Pickup & Drop", "Guided Ridge Trail", "Hot Poha & Ginger Chai", "Mineral Water Refills", "2 Certified Trek Coordinators", "First-Aid & Safety Escort"]'::jsonb,
    '["Sturdy Running/Hiking Shoes", "Valid College ID", "1L Reusable Water Bottle", "Small Daypack", "Light Jacket / Windcheater", "Camera or Charged Phone"]'::jsonb,
    '["Stay in single file on rocky ridges", "Strictly no stepping on unstable parapets", "Follow hike marshal instructions", "Zero alcohol or substance tolerance"]'::jsonb,
    true
),
(
    'a2222222-2222-2222-2222-222222222222',
    'bhangarh-midnight-expedition',
    'BHANGARH MIDNIGHT RUINS & STARGAZING',
    'Venture into the legendary Aravali ghost valley under a canopy of stars.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '12 days',
    'Saturday · 9:00 PM',
    599.00,
    30,
    12,
    'Challenging',
    'Known as India’s most haunted enclave, Bhangarh’s rugged outskirts offer world-class Aravali bouldering and zero-light pollution stargazing. Experience acoustic jam sessions by the campfire, night trail navigation with headlamps, and breakfast by the lakeside.',
    '["AC Traveller Pickup & Drop", "Campfire & Acoustic Session", "Midnight Snacks & Hot Maggi", "Headlamps & Glow Sticks", "3 Experienced Coordinators", "Telescope Stargazing Access"]'::jsonb,
    '["Warm Layers / Hoodie", "Headlamp or Flashlight", "Power Bank", "Campus ID", "Extra Pair of Socks"]'::jsonb,
    '["Never wander alone off the trail", "Stay within whistle audible range", "Comply with local heritage authority boundaries"]'::jsonb,
    true
),
(
    'a3333333-3333-3333-3333-333333333333',
    'hathni-kund-waterfall-trail',
    'HATHNI KUND FORGOTTEN VALLEY TREK',
    'Canyon descent into lush monsoon pools and prehistoric Aravali rock walls.',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '19 days',
    'Sunday · 6:30 AM',
    349.00,
    28,
    7,
    'Moderate',
    'A breathtaking descent into the hidden canyon of Hathni Kund. Scramble over granite boulders, cross freshwater springs, and discover a secluded temple buried deep within the forest. Includes breakfast sandwiches and energy drinks.',
    '["Tempo Traveller Pickup & Drop", "Canyon Route Guiding", "Healthy Sandwiches & Juice", "Electrolyte Hydration", "Professional Photography"]'::jsonb,
    '["Shoes with Good Grip", "Quick-dry Clothes", "Waterproof Pouch for Phone", "Sunscreen & Cap"]'::jsonb,
    '["Check footing on wet rocks", "No diving into unverified pool depths", "Stay hydrated at every 30-min break"]'::jsonb,
    true
),
(
    'a4444444-4444-4444-4444-444444444444',
    'chandlai-lake-sunset-ramble',
    'CHANDLAI LAKE FLAMINGO WALK & SUNSET',
    'Scenic birdwatching ramble and sunset chill session on the lake dyke.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '26 days',
    'Saturday · 3:30 PM',
    249.00,
    35,
    4,
    'Easy',
    'Perfect for beginners and photography enthusiasts. Walk the ancient mud bund of Chandlai lake as thousands of migratory flamingos and waterfowl gather. Wrap up the hike watching the sun dip behind the Aravalis with fresh samosas and chai.',
    '["Bus Pickup & Drop", "Birdwatching Binoculars", "Evening Snacks & Tea", "Community Chill Circle"]'::jsonb,
    '["Comfortable Walking Shoes", "Binoculars (optional)", "Sunglasses", "Water Bottle"]'::jsonb,
    '["Maintain silence near nesting colonies", "Stay on marked earthen embankment"]'::jsonb,
    true
);

-- 2. Hike Gallery Images
INSERT INTO public.hike_images (hike_id, image_url, caption, sort_order) VALUES
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80', 'First golden rays touching Nahargarh Fort', 1),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', 'Ridge scramble with Jaipur student squad', 2),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', 'Hot chai & breakfast circle at the summit', 3),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'Campfire stories beneath Aravali skies', 1),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 'Canyon pools hidden behind Hathni Kund', 1);

-- 3. Pickup Locations (Configurable in Database)
INSERT INTO public.pickup_locations (id, hike_id, title, landmark, pickup_time, map_url, capacity, is_active) VALUES
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'WTP / Gaurav Tower', 'Opposite World Trade Park Main Gate, JLN Marg', '04:45 AM', 'https://maps.google.com/?q=WTP+Jaipur', 20, true),
('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Raja Park (LBS College Corner)', 'Near Saras Dairy Booth, Tilak Nagar / Raja Park Link', '05:00 AM', 'https://maps.google.com/?q=Raja+Park+Jaipur', 20, true),
('b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Vaishali Nagar', 'Amrapali Circle Bus Stop', '04:30 AM', 'https://maps.google.com/?q=Amrapali+Circle+Jaipur', 20, true),
('b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'Mansarovar Metro Station', 'Gate No. 1 Auto Stand', '04:20 AM', 'https://maps.google.com/?q=Mansarovar+Metro+Jaipur', 20, true);

-- Also add global default pickup points for all hikes
INSERT INTO public.pickup_locations (id, hike_id, title, landmark, pickup_time, map_url, capacity, is_active) VALUES
('b5555555-5555-5555-5555-555555555555', NULL, 'WTP / Malviya Nagar Main Gate', 'World Trade Park JLN Marg Bus Bay', 'Scheduled with Hike', 'https://maps.google.com/?q=WTP+Jaipur', 50, true),
('b6666666-6666-6666-6666-666666666666', NULL, 'Raja Park Circle', 'LBS College Crossroad', 'Scheduled with Hike', 'https://maps.google.com/?q=Raja+Park+Jaipur', 50, true),
('b7777777-7777-7777-7777-777777777777', NULL, 'Vaishali Nagar Amrapali Circle', 'Near Big Bazaar / Police Chowki', 'Scheduled with Hike', 'https://maps.google.com/?q=Amrapali+Circle+Jaipur', 50, true),
('b8888888-8888-8888-8888-888888888888', NULL, 'Mansarovar Metro Gate 1', 'Metro Station Main Concourse', 'Scheduled with Hike', 'https://maps.google.com/?q=Mansarovar+Metro+Jaipur', 50, true);

-- 4. Active Voting Round & Destinations
INSERT INTO public.voting_rounds (id, title, description, start_date, end_date, is_active) VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'WEEKEND #42: WHERE SHOULD WE GO NEXT?',
    'Jaipur students decide the trail. The winning adventure will be scheduled for next weekend with exclusive student pricing.',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '4 days',
    true
);

INSERT INTO public.voting_options (id, round_id, title, subtitle, image_url, difficulty, votes_count) VALUES
('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Sambhar Salt Lake Camp & Stargazing', 'White desert vibes, tent setup & milky way observation', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', 'Moderate', 142),
('d2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Amer Sagar Secret Stepwell Trail', 'Forgotten 16th-century reservoir and forest ruins behind Amer', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', 'Easy', 98),
('d3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Garh Ganesh 365-Step Peak Scramble', 'Ancient steep rock staircase overlooking the whole walled city', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80', 'Challenging', 114),
('d4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'Chour Ghati Hidden Valley Trek', 'Monolith rock formations and quiet nature canyon near Galta', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 'Moderate', 76);

-- 5. Promotional Coupons
INSERT INTO public.coupons (
    id, code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, max_uses, uses_count, applicable_hikes, is_active
) VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'ONLYHIKES50',
    'fixed',
    50.00,
    299.00,
    50.00,
    NOW() + INTERVAL '60 days',
    500,
    24,
    '[]'::jsonb,
    true
),
(
    'e2222222-2222-2222-2222-222222222222',
    'JAIPURSTUDENT',
    'percentage',
    15.00,
    299.00,
    100.00,
    NOW() + INTERVAL '90 days',
    1000,
    58,
    '[]'::jsonb,
    true
),
(
    'e3333333-3333-3333-3333-333333333333',
    'SQUADUP',
    'fixed',
    150.00,
    800.00,
    150.00,
    NOW() + INTERVAL '30 days',
    200,
    11,
    '[]'::jsonb,
    true
);

-- 6. Explore Jaipur Categories & Items
INSERT INTO public.explore_categories (id, name, slug, description, sort_order) VALUES
('f1111111-1111-1111-1111-111111111111', 'Hiking', 'hiking', 'Rugged Aravali ridges and boulder trails around Jaipur', 1),
('f2222222-2222-2222-2222-222222222222', 'Forts', 'forts', 'Ancient defensive bastions with 360-degree viewpoints', 2),
('f3333333-3333-3333-3333-333333333333', 'Sunrise', 'sunrise', 'The most breathtaking morning light spots in the city', 3),
('f4444444-4444-4444-4444-444444444444', 'Sunset', 'sunset', 'Chill sunset perches to unwind after college classes', 4),
('f5555555-5555-5555-5555-555555555555', 'Nature', 'nature', 'Lakes, birding wetlands, and biodiversity sanctuaries', 5),
('f6666666-6666-6666-6666-666666666666', 'Hidden Spots', 'hidden-spots', 'Unmarked stepwells, forgotten ruins, and secluded canyons', 6);

INSERT INTO public.explore_items (category_id, title, location, best_time, difficulty, image_url, description, tips) VALUES
('f1111111-1111-1111-1111-111111111111', 'Nahargarh Back-Ridge Trail', 'Charan Mandir Route', '5:00 AM - 7:30 AM', 'Moderate', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80', 'The most popular trail among Jaipur college students. Passes through stone paths and thorn forest before climbing to the fort walls.', 'Start before 5:30 AM to catch the dawn glow. Carry good grip sneakers.'),
('f2222222-2222-2222-2222-222222222222', 'Jaigarh Secret Bastions', 'Amer Hills', '6:00 AM - 10:00 AM', 'Easy', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', 'The fortress of victory perched high above Amer Fort with expansive views over Maota Lake and Sagar reservoir.', 'Look for the interconnected underground tunnel leading toward Amer.'),
('f3333333-3333-3333-3333-333333333333', 'Garh Ganesh Sunrise Steps', 'Brahmapuri Ridge', '5:15 AM - 6:30 AM', 'Challenging', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', '365 steep stone steps built directly into the cliff face leading to an ancient fortress temple with sweeping city panoramas.', 'A great morning cardio blast. The temple does not allow phone photography inside.'),
('f6666666-6666-6666-6666-666666666666', 'Chour Ghati Forest Valley', 'Galta Gorge', '6:00 AM - 9:00 AM', 'Moderate', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 'A quiet valley between two towering Aravali spurs filled with natural stone caverns, peacocks, and desert flora.', 'Best visited in groups of 4 or more. Avoid feeding the rhesus monkeys.');

-- 7. Community Reviews (Clearly Marked Demo / Verified Student Architecture)
INSERT INTO public.reviews (hike_id, author_name, author_college, rating, comment, is_verified, is_featured) VALUES
('a1111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'MNIT Jaipur · CSE ''25', 5, 'Honestly thought I would regret waking up at 4:30 AM, but the sunrise from the ridge was pure magic. The bus pickup from WTP made everything super smooth. Meeting students from Manipal & JECRC was awesome!', true, true),
('a1111111-1111-1111-1111-111111111111', 'Tanvi Mathur', 'Manipal University Jaipur · Design', 5, 'The coordinators were so supportive! I was nervous about the rocky path, but they helped everyone through. The hot chai and poha at the top tasted 10x better after that climb.', true, true),
('a2222222-2222-2222-2222-222222222222', 'Rohan Khandelwal', 'Rajasthan University · Commerce', 5, 'Bhangarh night trek was wild! Stargazing away from city lights with acoustic songs by the fire was the best weekend I have had in Jaipur so far. Highly recommend the squad discount!', true, true);

-- 8. Site Content & Promotional Announcements
INSERT INTO public.site_content (section_key, title, subtitle, payload) VALUES
(
    'hero',
    'YOUR WEEKEND JUST GOT WILDER.',
    'Jaipur''s student hiking community.',
    '{"description": "Discover trails, forts, hidden spots and unforgettable weekends with people from your city.", "cta_primary": "EXPLORE HIKES →", "cta_secondary": "VOTE FOR NEXT HIKE", "badge": "1,200+ JAIPUR STUDENTS HIKED WITH US · DEMO DATA"}'::jsonb
),
(
    'announcement_bar',
    'NEXT TRIP FILLING FAST',
    'Nahargarh Sunrise Hike: Only 7 spots left!',
    '{"link": "/hikes/nahargarh-sunrise-hike", "active": true}'::jsonb
);
