# OnlyHikes.in — Supabase Setup & Migration Guide

This directory contains the complete database migrations, security policies, storage setup, and seed data for **OnlyHikes.in**.

## Quick Setup with Supabase CLI

If you have the Supabase CLI installed:

```bash
# 1. Initialize Supabase project
supabase init

# 2. Start local Supabase instance
supabase start

# 3. Apply migrations and seed data
supabase db reset
```

## Setup via Supabase Web Dashboard

If you are using a hosted Supabase project at [supabase.com](https://supabase.com):

1. **Create a new Project**:
   - Go to your Supabase Dashboard and click **New Project**.
   - Note down your Project URL and API Keys (`anon` public key and `service_role` secret key).

2. **Run Migrations in SQL Editor**:
   - Open **SQL Editor** in the left sidebar.
   - Run the contents of `supabase/migrations/001_initial_schema.sql`.
   - Run the contents of `supabase/migrations/002_rls_policies.sql`.
   - Run the contents of `supabase/migrations/003_storage_buckets.sql`.
   - Run the contents of `supabase/seed.sql` to populate initial Jaipur hikes, pickup locations, coupons, explore spots, and voting rounds.

3. **Verify Storage Buckets**:
   - Navigate to **Storage** in the sidebar.
   - Confirm that three public buckets exist: `posters`, `gallery`, and `avatars`.
   - If not created by the script, click **New Bucket**, set names to `posters`, `gallery`, and `avatars`, and toggle **Public bucket** to `ON`.

4. **Add Admin User**:
   - Create an account in your app via `/signup`.
   - In Supabase SQL Editor, run:
     ```sql
     INSERT INTO public.admin_roles (user_id, role)
     VALUES ('<YOUR_USER_UUID>', 'superadmin');
     ```

5. **Configure Environment Variables**:
   - Add your Supabase credentials into `frontend/.env.local` and `backend/.env`.
