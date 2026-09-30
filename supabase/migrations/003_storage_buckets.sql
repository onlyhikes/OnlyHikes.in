-- ====================================================================
-- ONLYHIKES.IN — SUPABASE DATABASE MIGRATION: 003_storage_buckets.sql
-- Idempotent Storage Buckets & Policies for Media Library
-- ====================================================================

-- Create storage buckets for OnlyHikes if not existing
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('brand', 'brand', true),
    ('posters', 'posters', true),
    ('gallery', 'gallery', true),
    ('videos', 'videos', true),
    ('reels', 'reels', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Read on all buckets
DROP POLICY IF EXISTS "Public Read Brand" ON storage.objects;
CREATE POLICY "Public Read Brand" ON storage.objects FOR SELECT USING (bucket_id = 'brand');

DROP POLICY IF EXISTS "Public Read Posters" ON storage.objects;
CREATE POLICY "Public Read Posters" ON storage.objects FOR SELECT USING (bucket_id = 'posters');

DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
CREATE POLICY "Public Read Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public Read Videos" ON storage.objects;
CREATE POLICY "Public Read Videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Public Read Reels" ON storage.objects;
CREATE POLICY "Public Read Reels" ON storage.objects FOR SELECT USING (bucket_id = 'reels');

DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Admin Upload/Update/Delete on all media buckets
DROP POLICY IF EXISTS "Admin Manage Media" ON storage.objects;
CREATE POLICY "Admin Manage Media" ON storage.objects
FOR ALL WITH CHECK (
    auth.role() = 'service_role' OR 
    EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- User Upload Avatar
DROP POLICY IF EXISTS "User Upload Avatar" ON storage.objects;
CREATE POLICY "User Upload Avatar" ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
