-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 003_storage_buckets.sql
-- ====================================================================

-- Create storage buckets for OnlyHikes if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('posters', 'posters', true),
    ('gallery', 'gallery', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies for Posters Bucket (Public read, authenticated/admin write)
CREATE POLICY "Public Read Posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

CREATE POLICY "Admin Upload Posters"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

CREATE POLICY "Admin Update Posters"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

CREATE POLICY "Admin Delete Posters"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

-- Policies for Gallery Bucket
CREATE POLICY "Public Read Gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admin Upload Gallery"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'gallery' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

-- Policies for Avatars Bucket
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "User Upload Avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
