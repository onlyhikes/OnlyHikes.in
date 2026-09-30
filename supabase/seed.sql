-- ====================================================================
-- ONLYHIKES.IN — PRODUCTION SEED DATA: seed.sql
-- Pure Database-Driven Content, Real Data Architecture, Zero Fake Metrics
-- ====================================================================

-- 1. Brand Settings Initial Record
INSERT INTO public.brand_settings (
    id, brand_name, logo_url, favicon_url, primary_color, secondary_color, accent_color,
    whatsapp_community_url, instagram_url, default_og_image
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'OnlyHikes',
    '/logo.svg',
    '/favicon.ico',
    '#CCFF00',
    '#FF5500',
    '#CCFF00',
    'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    'https://www.instagram.com/onlyhikes.in/',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (id) DO UPDATE SET
    whatsapp_community_url = EXCLUDED.whatsapp_community_url,
    instagram_url = EXCLUDED.instagram_url;

-- 2. Site Content CMS Entries
INSERT INTO public.site_content (section_key, content) VALUES
(
    'hero',
    '{
        "badge": "JAIPUR''S STUDENT ADVENTURE COMMUNITY",
        "headline_line1": "YOUR WEEKEND",
        "headline_line2": "JUST GOT WILDER.",
        "subtitle": "Don''t spend your weekend indoors. Go explore.",
        "description": "Discover curated Aravali trails, secret fort viewpoints, fresh morning chai, and unforgettable weekends with college squads from across Jaipur.",
        "primary_cta_text": "EXPLORE UPCOMING HIKES →",
        "primary_cta_link": "/hikes",
        "secondary_cta_text": "JOIN WHATSAPP TRIBE",
        "secondary_cta_link": "https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27",
        "background_media_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
        "background_media_type": "image",
        "overlay_opacity": 75
    }'::jsonb
),
(
    'why_jaipur',
    '{
        "badge": "THE ARAVALI CAPITAL",
        "title": "WHY EXPLORE JAIPUR''S OUTDOORS?",
        "subtitle": "Behind the pink stone facades lies India''s oldest geological mountain range.",
        "paragraphs": [
            "Most students spend four years in Jaipur seeing only mall corridors, coaching lanes, and crowded cafes. But right behind the city skyline rise the Aravali ridges — rugged, ancient, and breathtaking at sunrise.",
            "From secret step-trails behind Charan Mandir to misty canyon passes around Hathni Kund and quiet medieval ruins hidden in Alwar valley, Jaipur has some of North India''s best accessible trekking terrain.",
            "You don''t need a week of vacation or an expensive flight to Himachal. A wild weekend adventure is waiting just 30 minutes from your college campus."
        ],
        "highlights": [
            {"title": "Ancient Aravali Ridges", "desc": "Billions of years old trails overlooking the Pink City panorama."},
            {"title": "Dramatic Sunrises", "desc": "Watch the golden sun crest over historic battlements before the city wakes."},
            {"title": "Hidden Canyons & Stepwells", "desc": "Canyon passes, natural water pools, and tucked-away ruins."}
        ]
    }'::jsonb
),
(
    'why_adventure',
    '{
        "badge": "THE STUDENT RESET",
        "title": "WHY CHOOSE ADVENTURE?",
        "subtitle": "Trade screen fatigue and boring hostel routines for fresh Aravali ridge air.",
        "points": [
            {
                "number": "01",
                "title": "Break The Monotony",
                "desc": "Step outside your 10x10 hostel room. Push your physical limits and start Sunday with a surge of genuine dopamine."
            },
            {
                "number": "02",
                "title": "Real Connections",
                "desc": "Hike with college students from MNIT, Manipal, Amity, JECRC, Poornima, and RU. Real conversations, zero pretension."
            },
            {
                "number": "03",
                "title": "Unfiltered Memories",
                "desc": "Golden morning light on your face, shared ginger chai at the summit, and trail stories you''ll talk about all semester."
            },
            {
                "number": "04",
                "title": "Affordable Freedom",
                "desc": "Adventure designed specifically on a student budget. AC travel, safety marshals, food and logistics all sorted under ₹300."
            }
        ]
    }'::jsonb
),
(
    'why_onlyhikes',
    '{
        "badge": "OUR MISSION",
        "title": "NOT A TRAVEL AGENCY. A COMMUNITY.",
        "subtitle": "Built specifically for Jaipur''s youth and college adventurers.",
        "manifesto": "Traditional travel agencies treat you like a tourist with megaphones and commercial commissions. OnlyHikes was founded by students who wanted something real: curated weekend trails, verified trek coordinators your own age, AC coach pickup from central hubs, hot breakfast, and an environment with strictly zero alcohol or commercial nonsense.",
        "pillars": [
            {"title": "Zero Pretense", "desc": "Just raw trails, good people, and wild mornings."},
            {"title": "All-Inclusive Logistics", "desc": "Bus pickup, drops, food, hydration, and first-aid all handled."},
            {"title": "Certified Coordinators", "desc": "Trained trek marshals on every batch ensuring zero hiker gets left behind."}
        ]
    }'::jsonb
),
(
    'how_it_works',
    '{
        "badge": "SIMPLE PROCESS",
        "title": "HOW IT WORKS",
        "subtitle": "4 simple steps to your wildest weekend reset.",
        "steps": [
            {
                "step": "01",
                "title": "CHOOSE YOUR TRAIL",
                "desc": "Browse our curated weekend hikes. Check the route, timings, photos, and live available seats."
            },
            {
                "step": "02",
                "title": "BOOK YOUR PASS",
                "desc": "Select your seats, choose your nearest Jaipur pickup spot, apply your student promo code, and secure your ticket."
            },
            {
                "step": "03",
                "title": "WE PICK YOU UP",
                "desc": "Hop onto our comfortable AC bus at WTP Malviya Nagar or Mansarovar early Sunday morning. Meet your coordinators."
            },
            {
                "step": "04",
                "title": "HIKE, EAT & CONNECT",
                "desc": "Conquer the ridge trail, enjoy hot breakfast & ginger chai at the peak, take epic photos, and return refreshed by noon."
            }
        ]
    }'::jsonb
),
(
    'announcements',
    '{
        "is_active": true,
        "message": "🔥 Sunday Nahargarh Sunrise batch is live! AC bus pickup from WTP & Mansarovar. Limited seats remaining.",
        "link_text": "Book Pass →",
        "link_url": "/hikes"
    }'::jsonb
),
(
    'footer',
    '{
        "tagline": "YOUR WEEKEND JUST GOT WILDER.",
        "bio": "Jaipur''s premier student outdoor adventure community. We organize weekend Aravali treks, sunrise runs, AC bus pickup & drops, fresh food, and community memories for college students across Jaipur.",
        "support_email": "hello@onlyhikes.in",
        "support_phone": "+91 98765 43210",
        "instagram_url": "https://www.instagram.com/onlyhikes.in/",
        "whatsapp_url": "https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27"
    }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- 3. Pickup Locations
INSERT INTO public.pickup_locations (id, title, landmark, pickup_time, is_active) VALUES
('p1111111-1111-1111-1111-111111111111', 'WTP / Gaurav Tower', 'Main Gate, Jawahar Lal Nehru Marg, Malviya Nagar', '04:45 AM', true),
('p2222222-2222-2222-2222-222222222222', 'Mansarovar Metro Station', 'Pillar No. 24, Near Ticket Counter Entry', '05:05 AM', true),
('p3333333-3333-3333-3333-333333333333', 'Rambagh Circle / SMS Stadium', 'North Gate Bus Bay, Tonk Road', '05:20 AM', true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- 4. Initial Curated Hikes (Real Database Pricing: original_price & selling_price)
INSERT INTO public.hikes (
    id, slug, title, subtitle, poster_url, date, time, selling_price, original_price,
    total_seats, booked_seats, description, included_services, food_info, water_info,
    coordinators_info, things_to_carry, safety_rules, featured, background_media_url,
    background_media_type, primary_accent, secondary_accent, overlay_intensity, is_published
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
    499.00,
    30,
    0,
    'Start your Sunday with adrenaline instead of a hangover. We hike the secret step-trail behind Charan Mandir up to the highest ridgeline of Nahargarh. Watch golden light flood over the Pink City, enjoy hot chai and fresh breakfast with 25+ other young adventurers, and make memories that will make your classmates jealous.',
    '["AC Bus Pickup & Drop", "Guided Ridge Trail", "Hot Poha & Ginger Chai", "Mineral Water Refills", "2 Certified Trek Coordinators", "First-Aid Support"]'::jsonb,
    'Hot freshly cooked Poha with sev, bananas, and piping hot ginger-cardamom chai served at the ridge summit.',
    'Cold and room-temperature mineral water dispensers provided before the trek and at the summit.',
    '2 certified wilderness trek marshals lead the group with radio communication and first-aid kits.',
    '["Sturdy Running/Hiking Shoes", "Valid College ID Card", "1L Reusable Water Bottle", "Small Daypack", "Light Windcheater / Jacket"]'::jsonb,
    '["Stay in single file on rocky ridges", "Strictly no stepping on unstable parapets", "Follow hike coordinator instructions", "Zero alcohol or substance tolerance"]'::jsonb,
    true,
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1920&q=80',
    'image',
    '#CCFF00',
    '#FF7326',
    'dark',
    true
),
(
    'a2222222-2222-2222-2222-222222222222',
    'bhangarh-midnight-expedition',
    'BHANGARH MIDNIGHT RUINS & STARGAZING',
    'Venture into the legendary Aravali ghost valley under a canopy of stars.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '12 days',
    'Saturday · 11:30 PM',
    599.00,
    899.00,
    25,
    0,
    'The ultimate night adventure for thrill-seekers. We board our AC coach in Jaipur at midnight, journey through Aravali gorges to the outer valley perimeter of Bhangarh, stargaze under unpolluted night skies, and witness dawn break over the 17th-century ramparts.',
    '["AC Coach Jaipur to Alwar & Back", "Guided Valley Night Trail", "Midnight Sandwiches & Hot Coffee", "Morning Breakfast", "Safety Escort & Stargazing"]'::jsonb,
    'Midnight coffee and cheese sandwiches during stargazing, followed by morning parathas on the return.',
    'Packaged mineral water bottles distributed for night trek and morning return.',
    '3 Coordinators including certified night navigators and female coordinator escort.',
    '["Sturdy Shoes", "Power Bank & Phone Torch", "Warm Hoodie / Jacket", "College ID Card"]'::jsonb,
    '["Stay strictly in the group corridor", "No wandering into unlit dry wells", "Listen to night marshal whistles", "Strictly zero substance tolerance"]'::jsonb,
    true,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    'image',
    '#38BDF8',
    '#818CF8',
    'high_contrast',
    true
),
(
    'a3333333-3333-3333-3333-333333333333',
    'hathni-kund-waterfall-trail',
    'HATHNI KUND CANYON TRAIL',
    'Traverse Jaipur''s lush monsoon valley with hidden gorges and ancient stepwells.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    CURRENT_DATE + INTERVAL '19 days',
    'Sunday · 6:00 AM',
    349.00,
    549.00,
    30,
    0,
    'A rugged boulder and canyon trail through the Garh Ganesh valley up to Hathni Kund. Green canopy trails, natural seasonal waterfalls, stepwells, and ancient water reservoirs tucked away inside the dense northern Aravali fold.',
    '["AC Bus Pickup & Drop", "Guided Canyon Trail", "Fresh Samosas & Masala Chai", "Hydration Stations", "Certified Trek Marshals"]'::jsonb,
    'Warm breakfast with crispy samosas, bananas, and cardamom masala chai.',
    'Hydration refills at Base Camp and halfway mark.',
    '2 certified wilderness coordinators.',
    '["Grippy Running Shoes", "Extra Pair of Socks", "Rain Jacket", "College ID", "1L Water Bottle"]'::jsonb,
    '["Avoid mossy slippery boulders", "Single file along the canyon creek", "Keep all electronic gadgets waterproofed"]'::jsonb,
    false,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    'image',
    '#34D399',
    '#059669',
    'dark',
    true
)
ON CONFLICT (id) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    original_price = EXCLUDED.original_price,
    booked_seats = 0;

-- 5. Graphical Route Waypoints (Visual Journey Steps)
INSERT INTO public.route_waypoints (hike_id, title, description, icon, sort_order, estimated_duration, is_published) VALUES
('a1111111-1111-1111-1111-111111111111', 'Pickup Points (WTP & Mansarovar)', 'AC bus boarding at central Jaipur student hubs.', 'bus', 1, '25 mins', true),
('a1111111-1111-1111-1111-111111111111', 'Base Trailhead: Charan Mandir', 'Briefing by trek coordinators, stretching, and water refills.', 'footprints', 2, '15 mins', true),
('a1111111-1111-1111-1111-111111111111', 'The Aravali Ridge Trail', 'Ascent along the ancient stone steps and scenic mountain ridges.', 'mountain', 3, '40 mins', true),
('a1111111-1111-1111-1111-111111111111', 'Nahargarh Summit & Sunrise Point', 'Panoramic 360° views of Pink City bathed in dawn light.', 'sun', 4, '35 mins', true),
('a1111111-1111-1111-1111-111111111111', 'Fresh Breakfast & Ginger Chai', 'Community feast of hot poha, chai, and squad photos.', 'coffee', 5, '30 mins', true),
('a1111111-1111-1111-1111-111111111111', 'Return Coach Drop', 'Descent and comfortable AC coach drop back to Jaipur hubs by 10:30 AM.', 'flag', 6, '30 mins', true)
ON CONFLICT DO NOTHING;

-- 6. Coupons
INSERT INTO public.coupons (
    id, code, discount_type, discount_value, max_discount, min_order_amount, is_active
) VALUES (
    'c1111111-1111-1111-1111-111111111111',
    'ONLYHIKES50',
    'fixed',
    50.00,
    50.00,
    200.00,
    true
) ON CONFLICT (code) DO NOTHING;

-- 7. Explore Categories & Items
INSERT INTO public.explore_categories (id, name, slug, description, icon, sort_order) VALUES
('e1111111-1111-1111-1111-111111111111', 'Forts & Ridges', 'forts-ridges', 'Ancient Aravali bastions with panoramic city vantage points.', 'castle', 1),
('e2222222-2222-2222-2222-222222222222', 'Sunrise & Sunset Points', 'sunrise-sunset', 'Best spots to catch dawn breaking over the desert horizon.', 'sun', 2),
('e3333333-3333-3333-3333-333333333333', 'Hidden Gorges & Valleys', 'hidden-valleys', 'Canyons, stepwells, and quiet seasonal waterfalls.', 'compass', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.explore_items (category_id, title, description, image_url, location, best_time, is_published, sort_order) VALUES
('e1111111-1111-1111-1111-111111111111', 'Nahargarh Charan Mandir Trail', 'Secret gravel and stone step ascent leading up to the highest battlements.', 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80', 'Behind Charan Mandir', '5:15 AM - 7:30 AM', true, 1),
('e2222222-2222-2222-2222-222222222222', 'Galta Ji Sun Temple Ridge', 'Watch sunrise flood the entire Pink City valley from ancient temples.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', 'Galta Gate, East Jaipur', '5:45 AM - 7:00 AM', true, 1),
('e3333333-3333-3333-3333-333333333333', 'Hathni Kund Hidden Canyon', 'Secluded canyon gorge tucked behind Garh Ganesh hill.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', 'Near Garh Ganesh, Amber Road', '6:00 AM - 9:00 AM', true, 1)
ON CONFLICT DO NOTHING;
