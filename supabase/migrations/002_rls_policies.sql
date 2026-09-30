-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 002_rls_policies.sql
-- Idempotent RLS Policies & Triggers for Production CMS
-- ====================================================================

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = user_uid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all active tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hike_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_items ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Brand Settings
DROP POLICY IF EXISTS "Brand settings readable by everyone" ON public.brand_settings;
CREATE POLICY "Brand settings readable by everyone" ON public.brand_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brand settings manageable by admin" ON public.brand_settings;
CREATE POLICY "Brand settings manageable by admin" ON public.brand_settings
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 3. Site Content CMS
DROP POLICY IF EXISTS "Site content readable by everyone" ON public.site_content;
CREATE POLICY "Site content readable by everyone" ON public.site_content
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site content manageable by admin" ON public.site_content;
CREATE POLICY "Site content manageable by admin" ON public.site_content
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 4. Media Library
DROP POLICY IF EXISTS "Media library readable by everyone" ON public.media_library;
CREATE POLICY "Media library readable by everyone" ON public.media_library
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Media library manageable by admin" ON public.media_library;
CREATE POLICY "Media library manageable by admin" ON public.media_library
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 5. Hikes
DROP POLICY IF EXISTS "Published hikes are viewable by everyone" ON public.hikes;
CREATE POLICY "Published hikes are viewable by everyone" ON public.hikes
    FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage hikes" ON public.hikes;
CREATE POLICY "Admins can manage hikes" ON public.hikes
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 6. Hike Media & Route Waypoints
DROP POLICY IF EXISTS "Hike media viewable by everyone" ON public.hike_media;
CREATE POLICY "Hike media viewable by everyone" ON public.hike_media
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage hike media" ON public.hike_media;
CREATE POLICY "Admins can manage hike media" ON public.hike_media
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Route waypoints viewable by everyone" ON public.route_waypoints;
CREATE POLICY "Route waypoints viewable by everyone" ON public.route_waypoints
    FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage route waypoints" ON public.route_waypoints;
CREATE POLICY "Admins can manage route waypoints" ON public.route_waypoints
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 7. Pickup Locations
DROP POLICY IF EXISTS "Active pickup locations viewable by everyone" ON public.pickup_locations;
CREATE POLICY "Active pickup locations viewable by everyone" ON public.pickup_locations
    FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage pickup locations" ON public.pickup_locations;
CREATE POLICY "Admins can manage pickup locations" ON public.pickup_locations
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 8. Coupons
DROP POLICY IF EXISTS "Active coupons viewable by anyone" ON public.coupons;
CREATE POLICY "Active coupons viewable by anyone" ON public.coupons
    FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 9. Bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users can insert their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings
    FOR UPDATE USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 10. Reviews
DROP POLICY IF EXISTS "Approved reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Approved reviews viewable by everyone" ON public.reviews
    FOR SELECT USING (is_approved = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert reviews" ON public.reviews;
CREATE POLICY "Users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can moderate reviews" ON public.reviews;
CREATE POLICY "Admins can moderate reviews" ON public.reviews
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');

-- 11. Saved Hikes
DROP POLICY IF EXISTS "Users can view their own saved hikes" ON public.saved_hikes;
CREATE POLICY "Users can view their own saved hikes" ON public.saved_hikes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved hikes" ON public.saved_hikes;
CREATE POLICY "Users can insert their own saved hikes" ON public.saved_hikes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved hikes" ON public.saved_hikes;
CREATE POLICY "Users can delete their own saved hikes" ON public.saved_hikes
    FOR DELETE USING (auth.uid() = user_id);

-- 12. Explore Categories & Items
DROP POLICY IF EXISTS "Explore categories viewable by everyone" ON public.explore_categories;
CREATE POLICY "Explore categories viewable by everyone" ON public.explore_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Explore items viewable by everyone" ON public.explore_items;
CREATE POLICY "Explore items viewable by everyone" ON public.explore_items
    FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage explore items" ON public.explore_items;
CREATE POLICY "Admins can manage explore items" ON public.explore_items
    FOR ALL USING (public.is_admin(auth.uid()) OR auth.role() = 'service_role');
