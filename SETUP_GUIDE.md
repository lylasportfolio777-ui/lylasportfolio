# 📸 Production Photographer Booking System Setup & Deployment Guide

This guide walks you through setting up the production-ready booking system with **Supabase PostgreSQL** as the primary source of truth and **Google Calendar API** for external mobile synchronization.

---

## 1. Environment Variables Configuration (`.env.local`)

Create or update your `.env.local` file in the root of your Next.js project with the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth & Calendar API Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_CALENDAR_ID=primary

# Site Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TIMEZONE=Asia/Kolkata
```

> ⚠️ **IMPORTANT**: Never commit `SUPABASE_SERVICE_ROLE_KEY` or `GOOGLE_CLIENT_SECRET` to Git or expose them to the browser.

---

## 2. Supabase Database & Table Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Open the [`supabase_schema.sql`](file:///c:/Users/Manpreet/Desktop/awward/supabase_schema.sql) file generated in your project root.
4. Copy all content into the SQL Editor and click **Run**.
5. This creates:
   - `public.bookings` (Main bookings table with indexes on `booking_date`, `start_time`, `status`, `google_event_id`).
   - `public.booking_settings` (Configurable working hours, buffer duration, min/max advance rules, active services).
   - `public.google_oauth_tokens` (Secure server-side token storage).
   - Row Level Security (RLS) policies for anon public insertion and service-role protection.

---

## 3. Google OAuth 2.0 & Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **Photographer Portfolio Booking**.
3. In the left sidebar, navigate to **APIs & Services > Library**.
4. Search for **Google Calendar API** and click **Enable**.
5. Navigate to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type and click **Create**.
   - App Name: `Photographer Booking System`
   - User Support Email: your email.
   - Developer Contact Info: your email.
   - Click **Save & Continue**.
   - Under **Scopes**, click **Add or Remove Scopes** and add:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/userinfo.email`
   - Click **Save & Continue**.
6. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials** -> **OAuth Client ID**.
   - Application Type: **Web Application**.
   - Name: `Portfolio Booking OAuth Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://your-domain.vercel.app` (when deploying)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://your-domain.vercel.app/api/auth/google/callback`
   - Click **Create**.
7. Copy the generated **Client ID** and **Client Secret** into your `.env.local` file.

---

## 4. Photographer Google Account Connection

1. Start your development server: `npm run dev`.
2. Open `http://localhost:3000/admin/booking-settings` in your browser.
3. Click the **Connect Photographer Google Calendar** button.
4. Grant calendar access permissions.
5. After approval, you will be redirected back with a green **Connected** status showing your connected email account.
6. Now, whenever a client books a session on `/book`, a Google Calendar event will automatically pop up in your Google Calendar mobile app on your phone!

---

## 5. Main Booking Features & Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/book` | GET | Premium 4-step Client Booking Page |
| `/api/availability?date=YYYY-MM-DD` | GET | Real-time server availability calculator with working hours, advance rules & Google Calendar freebusy check |
| `/api/bookings` | POST | Zod validated booking submission with race-condition double booking protection |
| `/api/auth/google` | GET | Initiates Google OAuth consent screen |
| `/api/auth/google/callback` | GET | Exchanges code for refresh tokens & saves to Supabase |
| `/admin/bookings` | GET | Photographer Admin Dashboard with List & Calendar views, status updates & reschedule modal |
| `/admin/booking-settings` | GET/POST | Configure slot duration, buffer, min/max advance rules, working days & services |

---

## 6. Vercel Deployment Instructions

1. Push your repository to GitHub.
2. Import the repository into your [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, add all keys from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (Set to `https://your-custom-domain.vercel.app/api/auth/google/callback`)
   - `GOOGLE_CALENDAR_ID` (`primary`)
4. Click **Deploy**.
5. Once live, open `https://your-custom-domain.vercel.app/admin/booking-settings` and click **Connect Photographer Google Calendar** to link production OAuth!
