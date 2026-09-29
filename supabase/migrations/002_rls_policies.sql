-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 002_rls_policies.sql
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hike_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

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

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Hikes
CREATE POLICY "Published hikes are viewable by everyone" ON public.hikes
    FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert hikes" ON public.hikes
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update hikes" ON public.hikes
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete hikes" ON public.hikes
    FOR DELETE USING (public.is_admin(auth.uid()));

-- 3. Hike Images & Pickup Locations
CREATE POLICY "Hike images viewable by everyone" ON public.hike_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage hike images" ON public.hike_images
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Pickup locations viewable by everyone" ON public.pickup_locations
    FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage pickup locations" ON public.pickup_locations
    FOR ALL USING (public.is_admin(auth.uid()));

-- 4. Voting Rounds & Options
CREATE POLICY "Voting rounds viewable by everyone" ON public.voting_rounds
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage voting rounds" ON public.voting_rounds
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Voting options viewable by everyone" ON public.voting_options
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage voting options" ON public.voting_options
    FOR ALL USING (public.is_admin(auth.uid()));

-- 5. Votes (Enforce authentication & 1 vote per user)
CREATE POLICY "Users can view votes count" ON public.votes
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can cast one vote" ON public.votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users or guests can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update bookings" ON public.bookings
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- 7. Coupons
CREATE POLICY "Active coupons viewable by authenticated users" ON public.coupons
    FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin(auth.uid()));

-- 8. Reviews
CREATE POLICY "Verified reviews viewable by everyone" ON public.reviews
    FOR SELECT USING (is_verified = true OR auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can submit review" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Saved Hikes
CREATE POLICY "Users can manage their saved hikes" ON public.saved_hikes
    FOR ALL USING (auth.uid() = user_id);

-- 10. Referrals & Rewards
CREATE POLICY "Users can view their referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can view their reward balance" ON public.referral_rewards
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 11. Explore Categories & Items
CREATE POLICY "Explore categories viewable by everyone" ON public.explore_categories
    FOR SELECT USING (true);

CREATE POLICY "Explore items viewable by everyone" ON public.explore_items
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage explore" ON public.explore_items
    FOR ALL USING (public.is_admin(auth.uid()));

-- 12. Site Content
CREATE POLICY "Site content viewable by everyone" ON public.site_content
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content" ON public.site_content
    FOR ALL USING (public.is_admin(auth.uid()));

-- -------------------------------------------------------------------
-- DATABASE TRIGGERS: AUTOMATIC VOTING & BOOKING SEAT COUNTERS
-- -------------------------------------------------------------------

-- Function & Trigger to increment vote count
CREATE OR REPLACE FUNCTION public.handle_new_vote()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.voting_options
    SET votes_count = votes_count + 1
    WHERE id = NEW.option_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vote_added ON public.votes;
CREATE TRIGGER on_vote_added
    AFTER INSERT ON public.votes
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_vote();

-- Function & Trigger to update hike booked_seats upon booking confirmation
CREATE OR REPLACE FUNCTION public.handle_booking_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.payment_status = 'paid') OR
       (TG_OP = 'UPDATE' AND OLD.payment_status <> 'paid' AND NEW.payment_status = 'paid') THEN
        UPDATE public.hikes
        SET booked_seats = booked_seats + NEW.seats_count
        WHERE id = NEW.hike_id;
    ELSIF (TG_OP = 'UPDATE' AND OLD.payment_status = 'paid' AND (NEW.payment_status = 'refunded' OR NEW.payment_status = 'failed')) THEN
        UPDATE public.hikes
        SET booked_seats = GREATEST(0, booked_seats - OLD.seats_count)
        WHERE id = NEW.hike_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_status_change ON public.bookings;
CREATE TRIGGER on_booking_status_change
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_booking_seats();
