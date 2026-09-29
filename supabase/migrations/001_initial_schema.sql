-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 001_initial_schema.sql
-- ====================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    college TEXT,
    city TEXT DEFAULT 'Jaipur',
    avatar_url TEXT,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Admin Roles Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'coordinator')),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. Hikes Table
CREATE TABLE IF NOT EXISTS public.hikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    poster_url TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    booked_seats INTEGER NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Strenuous')),
    description TEXT NOT NULL,
    included_services JSONB NOT NULL DEFAULT '["Pickup & Drop", "Guided Hike", "Food", "Water", "Trek Coordinators"]'::jsonb,
    things_to_carry JSONB NOT NULL DEFAULT '["Comfortable Shoes", "Water Bottle (1L)", "ID Card", "Small Backpack", "Light Jacket"]'::jsonb,
    safety_rules JSONB NOT NULL DEFAULT '["Stay with the coordinator", "No straying from designated trails", "Emergency first-aid kit carried by team"]'::jsonb,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_seats_not_overbooked CHECK (booked_seats <= total_seats)
);

-- 4. Hike Gallery Images Table
CREATE TABLE IF NOT EXISTS public.hike_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Pickup Locations Table (Database-configured, NOT generic meeting point)
CREATE TABLE IF NOT EXISTS public.pickup_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID REFERENCES public.hikes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    landmark TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    map_url TEXT,
    capacity INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Voting Rounds Table
CREATE TABLE IF NOT EXISTS public.voting_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Voting Options Table (Destinations)
CREATE TABLE IF NOT EXISTS public.voting_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.voting_rounds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    difficulty TEXT DEFAULT 'Moderate',
    votes_count INTEGER NOT NULL DEFAULT 0 CHECK (votes_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Votes Table (Strictly 1 vote per user per round)
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.voting_rounds(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.voting_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_vote_per_round UNIQUE (round_id, user_id)
);

-- 9. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    expiry_date TIMESTAMPTZ,
    max_uses INTEGER,
    uses_count INTEGER NOT NULL DEFAULT 0 CHECK (uses_count >= 0),
    applicable_hikes JSONB DEFAULT '[]'::jsonb, -- Empty array implies all hikes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT UNIQUE NOT NULL,
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    student_college TEXT,
    seats_count INTEGER NOT NULL CHECK (seats_count > 0),
    pickup_location_id UUID REFERENCES public.pickup_locations(id) ON DELETE SET NULL,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    original_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'initiated', 'paid', 'failed', 'refunded')),
    payment_id TEXT,
    notes TEXT,
    whatsapp_group_url TEXT DEFAULT 'https://chat.whatsapp.com/demo-invite-jaipur-wild',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Booking Items / Attendees Table
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    attendee_name TEXT NOT NULL,
    attendee_phone TEXT
);

-- 12. Coupon Usage Table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    discount_applied NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hike_id UUID REFERENCES public.hikes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_college TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Saved Hikes Table
CREATE TABLE IF NOT EXISTS public.saved_hikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hike_id UUID NOT NULL REFERENCES public.hikes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, hike_id)
);

-- 15. Referrals Table (Invite your friends: Give ₹50. Get ₹50.)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    reward_amount NUMERIC(10, 2) DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 16. Referral Rewards Wallet Table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(10, 2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Explore Categories Table
CREATE TABLE IF NOT EXISTS public.explore_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- 18. Explore Items Table
CREATE TABLE IF NOT EXISTS public.explore_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.explore_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    best_time TEXT,
    difficulty TEXT DEFAULT 'Easy',
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    tips TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Site Content & Hero Announcements Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_hikes_date ON public.hikes(date);
CREATE INDEX IF NOT EXISTS idx_hikes_is_published ON public.hikes(is_published);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hike_id ON public.bookings(hike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_votes_round_id ON public.votes(round_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON public.votes(option_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
