-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 004_production_cms_schema.sql
-- Production-Ready, Database-Driven CMS, Real Metrics Only
-- No referrals, no campus leads, no difficulty levels, no fake data
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    college TEXT,
    city TEXT DEFAULT 'Jaipur',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remove referral_code column if it previously existed
ALTER TABLE public.profiles DROP COLUMN IF EXISTS referral_code;

-- 2. Admin Roles Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'coordinator')),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. Brand Settings Table (Central GUI Brand Management)
CREATE TABLE IF NOT EXISTS public.brand_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT DEFAULT 'OnlyHikes',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#CCFF00',
    secondary_color TEXT DEFAULT '#FF5500',
    accent_color TEXT DEFAULT '#CCFF00',
    whatsapp_community_url TEXT DEFAULT 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/onlyhikes.in/',
    default_og_image TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Content Table (Editorial Storytelling CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Media Library Table (Central File & Asset Storage)
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'poster', 'reel')),
    file_size INTEGER,
    placement TEXT DEFAULT 'unassigned' CHECK (placement IN ('homepage_hero', 'homepage_promo', 'trek_detail', 'booking_banner', 'gallery', 'unassigned')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hikes Table (Database-Driven Treks with Dynamic Pricing & Visual Themes)
CREATE TABLE IF NOT EXISTS public.hikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    poster_url TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= selling_price),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    booked_seats INTEGER NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
    description TEXT NOT NULL,
    included_services JSONB NOT NULL DEFAULT '["AC Bus Pickup & Drop", "Guided Ridge Trail", "Fresh Breakfast & Ginger Chai", "Mineral Water Refills", "Certified Trek Coordinators", "First-Aid Support"]'::jsonb,
    food_info TEXT DEFAULT 'Fresh hot breakfast (Poha / Sandwiches) & hot ginger chai included.',
    water_info TEXT DEFAULT 'Unlimited mineral water refills provided throughout the trek.',
    coordinators_info TEXT DEFAULT '2 Certified Trek Coordinators accompanying every student batch.',
    things_to_carry JSONB NOT NULL DEFAULT '["Sturdy Running/Hiking Shoes", "Valid College ID Card", "1L Reusable Water Bottle", "Small Daypack", "Light Jacket / Windcheater"]'::jsonb,
    safety_rules JSONB NOT NULL DEFAULT '["Stay with the coordinators on marked trails", "Strictly zero alcohol or substance tolerance", "Emergency first-aid kit available", "Notify coordinator in case of any medical discomfort"]'::jsonb,
    featured BOOLEAN DEFAULT FALSE,
    background_media_url TEXT,
    background_media_type TEXT DEFAULT 'image' CHECK (background_media_type IN ('image', 'video')),
    primary_accent TEXT DEFAULT '#CCFF00',
    secondary_accent TEXT DEFAULT '#FF5500',
    overlay_intensity TEXT DEFAULT 'dark' CHECK (overlay_intensity IN ('subtle', 'medium', 'dark', 'high_contrast')),
    meta_title TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_seats_not_overbooked CHECK (booked_seats <= total_seats)
);

-- Remove legacy difficulty column if table already exists
ALTER TABLE public.hikes DROP COLUMN IF EXISTS difficulty;
-- Ensure price column is mapped or migrated to selling_price if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hikes' AND column_name = 'price') THEN
        UPDATE public.hikes SET selling_price = price WHERE selling_price IS NULL;
        ALTER TABLE public.hikes ALTER COLUMN price DROP NOT NULL;
    END IF;
END $$;

-- 7. Hike Media Table (Posters, Galleries, Videos, Reels)
CREATE TABLE IF NOT EXISTS public.hike_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('poster', 'gallery', 'video', 'reel', 'background')),
    media_url TEXT NOT NULL,
    caption TEXT,
    thumbnail_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Graphical Route Waypoints Table (Interactive Visual Journey)
CREATE TABLE IF NOT EXISTS public.route_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'map-pin',
    sort_order INTEGER DEFAULT 0,
    estimated_duration TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Pickup Locations Table
CREATE TABLE IF NOT EXISTS public.pickup_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    landmark TEXT,
    pickup_time TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    max_discount NUMERIC(10, 2),
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_hike_id UUID REFERENCES public.hikes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Bookings Table (Real Bookings Only)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE RESTRICT,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    student_college TEXT,
    seats_count INTEGER NOT NULL CHECK (seats_count > 0),
    pickup_location_id UUID REFERENCES public.pickup_locations(id) ON DELETE SET NULL,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    original_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'initiated', 'paid', 'failed', 'refunded')),
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Booking Items Table
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE RESTRICT,
    seats_count INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- 13. Coupon Usage Table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Real Reviews Table (Moderated)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID REFERENCES public.hikes(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_college TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Saved Hikes Table (User Favorites)
CREATE TABLE IF NOT EXISTS public.saved_hikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, hike_id)
);

-- 16. Explore Categories & Items
CREATE TABLE IF NOT EXISTS public.explore_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'compass',
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.explore_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.explore_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT NOT NULL,
    best_time TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Voting Rounds & Ballots (Real Only)
CREATE TABLE IF NOT EXISTS public.voting_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.voting_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.voting_rounds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    votes_count INTEGER DEFAULT 0 CHECK (votes_count >= 0)
);

CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.voting_rounds(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.voting_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(round_id, user_id)
);

-- 18. Drop all legacy referral and campus lead tables
DROP TABLE IF EXISTS public.referral_rewards CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.campus_leads CASCADE;
DROP TABLE IF EXISTS public.campus_ambassadors CASCADE;

-- 19. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_hikes_published ON public.hikes(is_published, date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hike ON public.bookings(hike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_waypoints_hike ON public.route_waypoints(hike_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_hike_media ON public.hike_media(hike_id, media_type);
CREATE INDEX IF NOT EXISTS idx_saved_hikes_user ON public.saved_hikes(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);

-- 20. Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('brand', 'brand', true),
    ('posters', 'posters', true),
    ('gallery', 'gallery', true),
    ('videos', 'videos', true),
    ('reels', 'reels', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;
