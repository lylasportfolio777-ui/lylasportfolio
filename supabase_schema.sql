-- ========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR LUXURY BOOKING SYSTEM
-- ========================================================

-- 1. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'Asia/Kolkata' NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL,
  google_event_id TEXT,
  google_calendar_id TEXT
);

-- Indexes for lightning-fast queries and double-booking checks
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings (start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_google_event ON public.bookings (google_event_id);

-- 2. Create Booking Settings Table (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.booking_settings (
  id INT PRIMARY KEY DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  slot_duration_minutes INT DEFAULT 60 NOT NULL,
  buffer_duration_minutes INT DEFAULT 30 NOT NULL,
  min_advance_hours INT DEFAULT 24 NOT NULL,
  max_advance_days INT DEFAULT 180 NOT NULL,
  max_bookings_per_day INT DEFAULT 4 NOT NULL,
  timezone TEXT DEFAULT 'Asia/Kolkata' NOT NULL,
  working_hours JSONB NOT NULL DEFAULT '{
    "monday": { "enabled": true, "start": "09:00", "end": "18:00" },
    "tuesday": { "enabled": true, "start": "09:00", "end": "18:00" },
    "wednesday": { "enabled": true, "start": "09:00", "end": "18:00" },
    "thursday": { "enabled": true, "start": "09:00", "end": "18:00" },
    "friday": { "enabled": true, "start": "09:00", "end": "18:00" },
    "saturday": { "enabled": true, "start": "10:00", "end": "17:00" },
    "sunday": { "enabled": false, "start": "10:00", "end": "17:00" }
  }'::jsonb,
  services JSONB NOT NULL DEFAULT '[
    {"id": "wedding", "name": "Wedding Photography", "duration": 120, "description": "Full day luxury editorial coverage", "active": true},
    {"id": "pre-wedding", "name": "Pre-Wedding Photography", "duration": 90, "description": "Outdoor pre-wedding portrait session", "active": true},
    {"id": "portrait", "name": "Portrait Session", "duration": 60, "description": "Studio or location personal portraiture", "active": true},
    {"id": "couple", "name": "Couple Session", "duration": 60, "description": "Cinematic couple portrait session", "active": true},
    {"id": "family", "name": "Family Photography", "duration": 60, "description": "Memorable family portraits", "active": true},
    {"id": "event", "name": "Event Photography", "duration": 120, "description": "Private & commercial event coverage", "active": true},
    {"id": "custom", "name": "Custom Session", "duration": 60, "description": "Bespoke photography package", "active": true}
  ]'::jsonb,
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Insert default settings row if not exists
INSERT INTO public.booking_settings (id) 
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Google OAuth Tokens Table (Stores refresh token securely server-side)
CREATE TABLE IF NOT EXISTS public.google_oauth_tokens (
  id INT PRIMARY KEY DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  refresh_token TEXT DEFAULT '',
  access_token TEXT,
  expiry_date BIGINT,
  calendar_id TEXT DEFAULT 'primary',
  connected_email TEXT,
  CONSTRAINT single_google_tokens_row CHECK (id = 1)
);

-- Insert default placeholder row for OAuth tokens table
INSERT INTO public.google_oauth_tokens (id, refresh_token) 
VALUES (1, '')
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public read access to booking_settings
CREATE POLICY "Allow public read access to booking settings" 
  ON public.booking_settings FOR SELECT 
  USING (true);

-- Allow public booking creation (INSERT)
CREATE POLICY "Allow public to create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

-- Allow public read of bookings date & time for availability check
CREATE POLICY "Allow public read access to bookings date and times" 
  ON public.bookings FOR SELECT 
  USING (true);

-- Allow full access to service_role and authenticated users
CREATE POLICY "Allow service_role full access to bookings" 
  ON public.bookings FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Allow service_role full access to booking_settings" 
  ON public.booking_settings FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Allow service_role full access to google_oauth_tokens" 
  ON public.google_oauth_tokens FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
