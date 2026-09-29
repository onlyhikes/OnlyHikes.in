-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 003_storage_buckets.sql
-- Idempotent Storage Buckets & Policies
-- ====================================================================

-- Create storage buckets for OnlyHikes if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('posters', 'posters', true),
    ('gallery', 'gallery', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies for Posters Bucket (Public read, authenticated/admin write)
DROP POLICY IF EXISTS "Public Read Posters" ON storage.objects;
CREATE POLICY "Public Read Posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

DROP POLICY IF EXISTS "Admin Upload Posters" ON storage.objects;
CREATE POLICY "Admin Upload Posters"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Admin Update Posters" ON storage.objects;
CREATE POLICY "Admin Update Posters"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Admin Delete Posters" ON storage.objects;
CREATE POLICY "Admin Delete Posters"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posters' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

-- Policies for Gallery Bucket
DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
CREATE POLICY "Public Read Gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admin Upload Gallery" ON storage.objects;
CREATE POLICY "Admin Upload Gallery"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'gallery' AND 
    (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()))
);

-- Policies for Avatars Bucket
DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "User Upload Avatar" ON storage.objects;
CREATE POLICY "User Upload Avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
