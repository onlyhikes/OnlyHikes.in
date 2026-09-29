# 🌲 OnlyHikes.in — Jaipur's Student Adventure Community Platform

> **"YOUR WEEKEND JUST GOT WILDER."**  
> *"Don't spend your weekend indoors. Go explore."*

OnlyHikes is a Gen-Z outdoor lifestyle and student adventure community platform built specifically for college students and young adults in Jaipur, India. It handles curated Aravali hikes, guided sunrise & night treks, AC bus pickup & drop schedules, fresh food, verified coordinators, community destination voting, and student referral rewards.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, CORS, Supabase Client/Admin SDK.
- **Database**: Supabase PostgreSQL with 19 relational tables, row-level security (RLS), and database triggers for atomic seat allocation and vote counting.
- **Authentication**: Supabase Auth (with zero-friction local developer/student switcher).
- **Storage**: Supabase Storage buckets (`posters`, `gallery`, `avatars`).
- **Payments**: Pluggable Payment Gateway abstraction (Razorpay-ready signature verification; strict zero fake payment rule).
- **Deployment**: Configured for Vercel (Frontend) and Node.js container/PaaS (Backend).

---

## 📂 Project Structure

```
OnlyHikes.in/
├── backend/
│   ├── index.js                     # Express server & CORS configuration
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Configuration template
│   ├── middleware/
│   │   ├── auth.js                  # Supabase JWT & Admin authorization
│   │   └── errorHandler.js          # Centralized error responses
│   ├── controllers/
│   │   ├── hikeController.js        # Hike CRUD & poster updates
│   │   ├── bookingController.js     # Seat inventory & booking pipeline
│   │   ├── couponController.js      # Server-side discount calculation
│   │   ├── voteController.js        # Strict 1-vote-per-user ballot system
│   │   ├── pickupController.js      # Designated pickup spots & manifests
│   │   ├── userController.js        # Profile, booking history, referral wallet
│   │   ├── adminController.js       # KPI metrics & CSV export
│   │   └── paymentController.js     # Gateway status & order creation
│   ├── services/
│   │   ├── supabaseService.js       # Live Supabase client initialization
│   │   ├── mockDataService.js       # High-fidelity in-memory fallback store
│   │   └── paymentGatewayService.js # Gateway abstraction (Razorpay/Mock)
│   └── utils/
│       ├── couponValidator.js       # Server-side validation logic
│       └── seatValidator.js         # Overbooking prevention & seat math
│
├── frontend/
│   ├── package.json                 # Next.js, Framer Motion, Tailwind, etc.
│   ├── next.config.js               # Remote image patterns for posters
│   ├── tailwind.config.js           # Charcoal, Acid Lime (#CCFF00), Flame theme
│   ├── postcss.config.js
│   ├── .env.example                 # Frontend env template
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js            # Sticky, shrinking on scroll, mobile drawer
│   │   │   ├── Footer.js            # Editorial design, big mark, campus rep CTA
│   │   │   └── Layout.js
│   │   ├── ui/
│   │   │   ├── Button.js            # Framer motion micro-interactions
│   │   │   ├── Badge.js             # Acid, flame, and demo tags
│   │   │   └── SeatProgressBar.js   # Live remaining seat status
│   │   ├── hikes/
│   │   │   └── TrekCard.js          # Reusable trek card with poster & badges
│   │   ├── voting/
│   │   │   └── VoteCard.js          # Animated voting bars & live ballot
│   │   └── admin/
│   │       ├── AdminLayout.js       # Sidebar & coordinator navigation
│   │       └── PosterUploader.js    # Live Supabase Storage poster upload
│   ├── pages/
│   │   ├── _app.js                  # AuthProvider, font & global styles
│   │   ├── _document.js             # SEO & typography
│   │   ├── index.js                 # High-impact Hero, Upcoming Hikes, Vibe
│   │   ├── hikes/
│   │   │   ├── index.js             # Full Trail Directory & Filters
│   │   │   └── [id].js              # Trek Detail (large poster, pickups, sticky CTA)
│   │   ├── book/
│   │   │   └── [id].js              # Booking Checkout & Coupon Engine
│   │   ├── booking/confirmation/
│   │   │   └── [id].js              # Confirmed Ticket & WhatsApp link
│   │   ├── vote.js                  # Community Destination Ballot
│   │   ├── explore.js               # Explore Jaipur secret spots
│   │   ├── account/
│   │   │   └── index.js             # Student Account (Bookings, Referral ₹50)
│   │   ├── login.js                 # Student login & quick switcher
│   │   ├── signup.js                # Student signup with College & City
│   │   ├── forgot-password.js       # Password reset
│   │   └── admin/
│   │       ├── index.js             # Overview KPI metrics
│   │       ├── hikes.js             # Hike CRUD & poster replacement
│   │       ├── bookings.js          # Bookings table & CSV export
│   │       ├── pickups.js           # Pickup locations & passenger counts
│   │       ├── voting.js            # Community voting round manager
│   │       ├── coupons.js           # Promo code creator (fixed/percentage)
│   │       └── users.js             # Student directory
│   ├── context/
│   │   └── AuthContext.js           # Supabase + instant demo student/admin
│   ├── lib/
│   │   ├── api.js                   # Typed fetch wrapper to Express API
│   │   └── supabaseClient.js        # Supabase client singleton
│   └── styles/
│       └── globals.css              # Custom font tokens, noise grain, scrollbars
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql   # 19 tables with indexes & constraints
│   │   ├── 002_rls_policies.sql     # RLS policies & automatic triggers
│   │   └── 003_storage_buckets.sql  # Posters, gallery, avatars storage buckets
│   ├── seed.sql                     # Rich Jaipur student hiking seed data
│   └── README.md                    # Database deployment guide
│
└── README.md                        # Master documentation
```

---

## 🚀 Quick Start (Local Development)

The application includes an integrated **High-Fidelity Local Engine**, meaning it boots and operates **100% out of the box** without blocking on external database setup. Once Supabase credentials are provided, it automatically connects to live PostgreSQL and Storage.

### 1. Run the Backend API Server
```bash
cd backend
npm install
node index.js
# Backend runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 2. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## 🔑 Environment Variables Required

### Backend (`backend/.env`):
| Variable | Description |
|---|---|
| `PORT` | API port (default: `5000`) |
| `FRONTEND_URL` | Allowed origin for CORS (e.g. `http://localhost:3000`) |
| `SUPABASE_URL` | Your Supabase Project URL (`https://xyz.supabase.co`) |
| `SUPABASE_ANON_KEY` | Supabase Anon Public API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key |
| `ADMIN_SECRET_KEY` | Master passkey for local admin verification |
| `RAZORPAY_KEY_ID` | Production/Test Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Production/Test Razorpay Secret Key |
| `ENABLE_SANDBOX_PAYMENT_SIMULATION` | `true` or `false` (enables simulated test checkout) |
| `DEFAULT_WHATSAPP_GROUP_URL` | Configurable WhatsApp link for confirmed hikers |

### Frontend (`frontend/.env.local`):
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Express backend endpoint (`http://localhost:5000/api`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | Configurable WhatsApp squad invite link |
| `NEXT_PUBLIC_ADMIN_DEV_KEY` | Master admin passphrase for quick admin preview |

---

## 🗄️ Supabase Setup & Database Migration

1. In your [Supabase Dashboard](https://supabase.com), create a new project.
2. Go to **SQL Editor** and run the migration scripts in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_buckets.sql`
   - `supabase/seed.sql`
3. Under **Storage**, ensure public buckets `posters`, `gallery`, and `avatars` exist.
4. Copy your Project URL, Anon Key, and Service Role Key to `backend/.env` and `frontend/.env.local`.

---

## 💳 Payment Gateway Compliance & Statuses

As specified:
- **No Fake Payment Success**: Bookings are **never** marked as `paid` without a verified gateway transaction.
- If `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are not set in the environment, the checkout UI will display:
  > **"Payment gateway is not configured yet."**
- Supported booking statuses: `pending`, `initiated`, `paid`, `failed`, `refunded`.
- To test checkout simulation without real money, set `ENABLE_SANDBOX_PAYMENT_SIMULATION=true` in `backend/.env`.

---

## 🖼️ Critical Requirement: Poster Management

1. In the Coordinator Admin (`/admin/hikes`), coordinators can upload a new trek poster directly to Supabase Storage or enter an image URL.
2. The URL is saved against the hike record in the database.
3. The new poster **instantly and automatically updates** across:
   - The Homepage featured hikes
   - The Hikes directory listing
   - The Trek detail page
   - The Admin preview
4. No frontend code changes or restarts are required.

---

## 🚢 Production Deployment Instructions

### Frontend (Vercel)
1. Import the `frontend` folder to Vercel.
2. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your deployed backend URL + `/api`
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase Anon Key
3. Framework Preset: **Next.js**.

### Backend (Node.js / Render / Railway / AWS EC2)
1. Deploy the `backend` folder as a Node.js web service.
2. Start command: `node index.js`.
3. Set Environment Variables matching `backend/.env.example`.
4. Ensure CORS `FRONTEND_URL` is set to your Vercel production domain.

---

## 📋 What Remains Intentionally Unconfigured

In accordance with strict prompt instructions:
1. **Third-Party Payment Keys**: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` remain empty in `.env` to prevent exposing private credentials or creating fake payments. The app cleanly reports *"Payment gateway is not configured yet."*
2. **Real WhatsApp Group URL**: Uses a configurable placeholder link (`https://chat.whatsapp.com/demo-invite-jaipur-wild`) rather than fabricating a live WhatsApp group.
3. **Live Supabase Credentials**: Uses placeholder keys with a high-fidelity local fallback engine until production project keys are plugged in.
