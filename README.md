# Trip Connect — Full-Stack Travel Agency Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/Status-Production--Ready-087EBC)](#)

A modern, enquiry-led travel website and administrator CRM for **Trip Connect**, a travel agency based in Kochi, Kerala, India. Built with Apple-inspired minimalist design principles, cinematic Kerala travel photography, a persistent database layer, CRM enquiry workflows, and technical SEO/privacy foundations.

---

## 1. Core Business Model & Principles

- **Enquiry-Led Flow:** Strictly **no direct checkout, no online payment processing, and no live booking engine**.
- **Transparent Starting Estimates:** All published rates represent estimated starting prices per person (`/person`) based on twin-sharing accommodation and seasonal variations. An enquiry does **not** constitute a confirmed reservation.
- **Strict Admin Allowlist:** Administrative portal and private customer CRM data access is strictly restricted to:
  $$\text{Admin Allowlist: } \mathbf{dmtripconnectin@gmail.com}$$
- **Curated Package Publishing Workflow:** Packages follow an audited 4-stage lifecycle:
  $$\text{Create} \longrightarrow \text{Save Draft} \longrightarrow \text{Pre-flight Verification Checklist} \longrightarrow \text{Publish}$$
- **Genuine Testimonials & Active Offers:** Only authentic customer reviews and current, date-valid special offers are displayed on the public platform.

---

## 2. Design System & Brand Identity

| Element | Specification | Hex / Value |
| :--- | :--- | :--- |
| **Primary Accent** | Ocean Blue | `#087EBC` |
| **Primary Dark / Typography** | Charcoal | `#20252B` |
| **Background / Muted** | Soft Grey | `#F1F4F7` |
| **Canvas / Base** | Clean White | `#FFFFFF` |
| **Design Language** | Apple Minimalist | Clean typography, generous whitespace, refined rounded cards, subtle drop shadows |
| **WhatsApp Direct Link** | Kochi Concierge | `+91 9400886838` |

---

## 3. Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components & Client Boundaries)
- **Language:** TypeScript 5.7 (Strict Type Checking)
- **Styling:** Tailwind CSS with custom typography and color extensions
- **Database:** Supabase PostgreSQL (Production) / Local Resilient JSON Database Engine (`.data/db.json` development fallback)
- **Authentication:** Firebase Authentication with Google Sign-In (`signInWithPopup`), backed by strict server-side Allowlist for `dmtripconnectin@gmail.com`
- **Notifications:** Resend API email integration with HTML concierge notification templates, and pre-filled WhatsApp click-to-chat links
- **SEO & Structured Data:** Next.js dynamic XML Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), and Schema.org `TravelAgency` + `TouristTrip` JSON-LD
- **Security:** In-memory rate limiting, hidden bot honeypots, and RFC 4180 CSV export with formula injection sanitization

---

## 4. Route Architecture

### Public Guest Routes
- `/` — Homepage (Hero, Kerala Flagship Tours, Featured Itineraries, Destinations, Why Trip Connect, Customer Reviews, Special Offers, Trip Planner)
- `/packages` — All Travel Packages with search, category tabs, destination filters, and budget sliders
- `/packages/[slug]` — Detailed package presentation with day-by-day itinerary accordion, inclusions, exclusions, starting prices, and tailored enquiry form
- `/destinations` — Kerala & India destination atlas
- `/destinations/[slug]` — Destination profile with linked packages
- `/offers` — Active seasonal promotions and discounts
- `/about` — The Trip Connect Kochi heritage, values, and travel standards
- `/contact` — Comprehensive enquiry form with date picker, traveller count, and package selector
- `/privacy-policy` — DPDP Act & GDPR compliant privacy notice with cookie controls
- `/terms` — Booking conditions, enquiry policies, and liability disclaimers
- `/sitemap.xml` & `/robots.txt` — Search engine discovery and indexing controls

### Administrator Portal (Protected by Route Guard)
- `/admin/login` — Sign in with Google / allowlisted admin email
- `/admin/unauthorized` — Graceful access denial for unauthorized email addresses
- `/admin` — KPI dashboard overview (Total Leads, New Inquiries, In-Progress, Active Packages, Direct Actions)
- `/admin/enquiries` — Complete CRM with status filters (`new`, `contacted`, `quoted`, `confirmed`, `lost`), quick WhatsApp direct chat, detail drawer, internal follow-up notes, and CSV export
- `/admin/packages` — Travel package manager with draft/published status badges, pre-flight verification checklist, and modal package editor
- `/admin/destinations` — Destination atlas manager
- `/admin/offers` — Promotional discount manager with date validity
- `/admin/reviews` — Customer review approval queue (ensuring only verified genuine feedback is shown)
- `/admin/settings` — Business contact hours, WhatsApp number, and integration diagnostics

---

## 5. Security & Data Protection Controls

1. **Spreadsheet Formula Injection Sanitization:**
   When exporting enquiries to CSV (`/api/admin/enquiries/export`), all fields are scrubbed. Any entry beginning with dangerous spreadsheet execution symbols (`=`, `+`, `-`, `@`, `\t`, `\r`) is automatically prefixed with a single quote (`'`), neutralizing macro execution risks in Microsoft Excel and LibreOffice Calc.
2. **Bot Honeypot Trap:**
   All public forms include an invisible honeypot field (`bot_trap`). If a spam robot fills this field, the server silently returns HTTP 200 without creating database records or triggering email alerts.
3. **Rate Limiting:**
   IP-based rate limiting on `/api/enquiries` throttles submissions to 5 per 10 minutes per IP address.
4. **Strict Route Protection:**
   Next.js middleware protects all `/admin/*` and `/api/admin/*` endpoints (except `/admin/login` and `/api/admin/auth/login`), checking for a valid, cryptographically verified session matching `dmtripconnectin@gmail.com`.

---

## 6. Database Migration & Schema

The complete PostgreSQL schema is located at:
`supabase/migrations/20261015000000_initial_schema.sql`

To apply the schema to your hosted Supabase instance:
1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** > **New Query**.
3. Paste the contents of `supabase/migrations/20261015000000_initial_schema.sql` and run.
4. The migration creates tables for `destinations`, `packages`, `enquiries`, `enquiry_notes`, `offers`, `reviews`, `package_media`, `notification_logs`, and `site_settings` with Row Level Security (RLS) enabled.

---

## 6b. Firebase Google Authentication Setup

The administrator portal supports one-click **Sign in with Google** via Firebase Authentication.

### Setup Instructions:
1. Open the [Firebase Console](https://console.firebase.google.com/) and create a project or select an existing one.
2. Under **Build > Authentication**, click **Get Started**.
3. Under the **Sign-in method** tab, click **Google**, enable it, specify your project support email, and save.
4. Under the **Settings > Authorized domains** tab, ensure `localhost` is listed (do not include `http://` or port numbers). In production, add your custom domain (e.g. `tripconnect.in`).
5. Go to **Project Settings > General > Your Apps**, click the Web icon (`</>`), register your web app, and copy the `firebaseConfig` keys into `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="trip-connect-kerala.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="trip-connect-kerala"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="trip-connect-kerala.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
   NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
   ```
6. When signing in at `/admin/login`, users authenticate with their Google account. The backend strictly permits entry only to accounts matching `dmtripconnectin@gmail.com`. All other accounts are safely rejected with HTTP 403.

---

## 7. Local Setup & Quickstart

### Prerequisites
- Node.js v18.18+ or v20+ (tested on Node v24.21.0)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone <repository-url>
cd "WEBSIT 2"

# 2. Install dependencies
npm install

# 3. Create your local environment configuration
copy .env.example .env.local

# 4. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Automated Test Suite
Run the end-to-end integration test suite against the running server:
```bash
node scripts/verify-system.mjs
```
The test verifies:
- All 13 public routes and SEO files return HTTP 200
- Public enquiry submission and validation
- Bot honeypot trapping
- Strict allowlist authentication (`dmtripconnectin@gmail.com` accepted, unauthorized rejected with 403)
- Admin CRM status transitions and internal note appending
- RFC 4180 CSV export with formula injection sanitization
- Package draft vs. published verification checklist
- Site settings and reviews API

---

## 8. Production Deployment to Vercel

1. **Push to GitHub:**
   Commit all code and push to your private or public GitHub repository.
2. **Import to Vercel:**
   Go to [Vercel](https://vercel.com/), select **Add New Project**, and import your repository.
3. **Set Environment Variables:**
   Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://tripconnect.in`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Secret Key
   - `ADMIN_ALLOWED_EMAIL`: `dmtripconnectin@gmail.com`
   - `RESEND_API_KEY`: Your Resend API Key (for transactional concierge emails)
   - `NEXT_PUBLIC_WHATSAPP_PHONE`: `919400886838`
4. **Deploy:**
   Click **Deploy**. Vercel will build the Next.js App Router application and provision edge and serverless routes.

---

## 9. Launch Verification Checklist

- [x] Responsive navigation with Kochi concierge WhatsApp floating button.
- [x] Kerala tours showcased with highest visual priority.
- [x] Day-by-day itineraries, inclusions, and exclusions for all flagship packages.
- [x] Starting price per person disclaimers placed on every package view.
- [x] Honeypot and rate limiting enabled on all public enquiry forms.
- [x] Email notification dispatch with graceful console fallback.
- [x] WhatsApp click-to-chat URL generation with package and date context.
- [x] Admin login restricted strictly to `dmtripconnectin@gmail.com`.
- [x] Admin CRM with status pipeline (`new`, `contacted`, `quoted`, `confirmed`, `lost`).
- [x] CSV export protected against spreadsheet formula injection.
- [x] Package verification checklist enforced before publishing.
- [x] Dynamic XML Sitemap (`/sitemap.xml`) and Robots (`/robots.txt`) configured.
- [x] Schema.org JSON-LD structured data for TravelAgency and TouristTrip.
- [x] DPDP Act / GDPR Privacy Policy and Terms & Conditions published.
- [x] Automated test suite passing with 28/28 assertions.
