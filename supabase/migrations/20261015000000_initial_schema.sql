-- ==============================================================================
-- Trip Connect - Production Database Schema Migration
-- Designed for Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Administrator allowlist & roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('Kerala', 'South India', 'North India', 'Pan India')),
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Kerala Tours',
    'India Tours',
    'Family Trips',
    'Honeymoon Packages',
    'Adventure & Nature',
    'Weekend & Short Trips',
    'Custom / Tailor-Made Trips'
  )),
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  starting_price NUMERIC(10, 2) NOT NULL CHECK (starting_price >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  duration_nights INTEGER NOT NULL CHECK (duration_nights >= 0),
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  accommodation_details TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  departure_dates TEXT,
  availability_notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  content_verified BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  preferred_destination TEXT,
  travel_date DATE,
  traveller_count INTEGER NOT NULL DEFAULT 2 CHECK (traveller_count > 0),
  additional_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'closed')),
  privacy_notice_version TEXT NOT NULL DEFAULT '1.0',
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent_timestamp TIMESTAMPTZ,
  source_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enquiry Notes Table (CRM internal follow-up)
CREATE TABLE IF NOT EXISTS public.enquiry_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'tripconnectwebsite2@gmail.com',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'special_perk')),
  discount_value NUMERIC(10, 2),
  promotional_price NUMERIC(10, 2),
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'expired')),
  content_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (valid_until >= valid_from)
);

-- 7. Reviews Table (Genuine reviews only)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_display_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  source_or_verification_note TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Package Media Table
CREATE TABLE IF NOT EXISTS public.package_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Notification Logs Table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'internal')),
  notification_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending', 'simulated')),
  provider_message_id TEXT,
  error_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_category ON public.packages(category);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_validity ON public.offers(valid_from, valid_until, status);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is the designated admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'tripconnectwebsite2@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND email = 'tripconnectwebsite2@gmail.com'
      AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies
CREATE POLICY "Public can view published destinations"
  ON public.destinations FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view published verified packages"
  ON public.packages FOR SELECT
  USING (status = 'published' AND content_verified = TRUE);

CREATE POLICY "Public can view active current offers"
  ON public.offers FOR SELECT
  USING (status = 'active' AND content_verified = TRUE AND CURRENT_DATE BETWEEN valid_from AND valid_until);

CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Public can view public package media"
  ON public.package_media FOR SELECT
  USING (TRUE);

CREATE POLICY "Public can view public site settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

-- Public Enquiry Insertion Policy
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (TRUE);

-- Admin Full Access Policies
CREATE POLICY "Admin has full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to destinations"
  ON public.destinations FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to packages"
  ON public.packages FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to enquiries"
  ON public.enquiries FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to enquiry notes"
  ON public.enquiry_notes FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to offers"
  ON public.offers FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to reviews"
  ON public.reviews FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to package media"
  ON public.package_media FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to notification logs"
  ON public.notification_logs FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin has full access to site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());
