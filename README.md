# 🏠 RentNest — Production-Ready Rental Home Platform (Rajkot, Gujarat)

> **Transparent, high-trust rental property marketplace eliminating ghost broker ads, hidden sub-meter electricity tariffs, and deposit disputes.**

---

## ⚡ Tech Stack & Production Architecture

- **Backend**: Node.js v20+, Express.js, MongoDB (Mongoose 8), Socket.io (JWT-authenticated WebSockets), Multer + Cloudinary CDN, JWT + `HttpOnly` Cookie Authentication (Phone OTP + Role RBAC), Helmet, Rate Limiting & NoSQL Sanitization
- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet (Interactive OpenStreetMap Split-Screen), Lucide Icons, React Router DOM, React Hot Toast, PWA (Progressive Web App)
- **Database**: MongoDB (Local `127.0.0.1:27017` or MongoDB Atlas Cloud)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string.

### 2. Backend Setup & Seed
```bash
# Navigate to server directory
cd server

# Install dependencies (already completed)
npm install

# Seed authentic Rajkot rental listings & demo accounts (Tenant, Owner, Broker, Admin)
npm run seed

# Start API server (starts on http://localhost:5000)
npm run dev
```

### 3. Frontend Client Setup
```bash
# Navigate to client directory
cd client

# Install dependencies (already completed)
npm install

# Start Vite development server (starts on http://localhost:5173)
npm run dev
```

---

## 🐳 Running with Docker (1-Command Containerized Setup)

The entire MERN stack (MongoDB, Node.js Server, and Nginx React Client) is completely dockerized:

```bash
# 1. Build and start all 3 containers in background
docker compose up --build -d

# 2. Seed database inside Docker container
docker compose exec server npm run seed

# 3. View logs
docker compose logs -f

# 4. Stop all containers
docker compose down
```

* **Frontend Web Client**: [http://localhost](http://localhost) (or [http://localhost:80](http://localhost:80))
* **Backend REST API**: [http://localhost:5000](http://localhost:5000)
* **MongoDB**: `mongodb://localhost:27017`

For local development with live-reload volume mounts:
```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## 🌟 Complete Feature Set (100% Implemented)

1. **Multi-City & Commercial Split-Screen Map Discovery**: Interactive Leaflet Map across **Rajkot, Ahmedabad, Surat & Vadodara** with price pins synchronized with Residential & Commercial property cards (HP load, phase type, road frontage, BU & Fire NOC filters).
2. **Living Reality Transparency Hub**:
   - Explicit declaration of **PGVCL Government Meter** (bill rate) vs **Sub-meter** (fixed ₹/kWh rate).
   - Water supply reality: **24/7 Continuous** vs scheduled municipal corporation timings.
   - Dietary & Cultural rules: **Pure Vegetarian Only** vs Any.
3. **Interactive Living Cost Estimator**: Tenant can adjust monthly expected electricity consumption units to see total monthly outflow (*Rent + Maintenance + Electricity + Water*).
4. **Roommates & Flatmate Sharing Marketplace (`/roommates`)**: Dedicated section for students & young working professionals with gender filters (Female Only / Male Only), budget filters, and direct WhatsApp contact.
5. **Real-Time In-App Chat & Anti-Fraud Guard**: Socket.io live chat drawer between tenants and landlords with security warnings against advance money transfers.
6. **Owner KYC Verification, Admin Analytics & Users CRUD (`/admin`)**:
   - Landlords upload electricity bills (PGVCL) or property tax receipts to earn the green **"Verified Owner"** badge; raw KYC bill URLs are automatically purged after admin review.
   - **Overview & KYC Queue**: Approve/reject pending landlord verification proofs and track live platform KPIs.
   - **Platform Analytics (`/admin?tab=analytics`)**: Role breakdown, residential vs. commercial inventory, quarantined/soft-deleted counts, visit pass funnel, city averages, and top-10 locality rent benchmarks.
   - **Users Management CRUD (`/admin?tab=users`)**: Search and filter users by role/status, create new users, edit roles/verification badges, soft-delete accounts, and restore deactivated users.
7. **Direct Cloudinary Image Upload**: Drag-and-drop image uploader in the Post Property wizard and KYC modal uploading directly to Cloudinary CDN with fallback resilience.
8. **Save Search & Instant WhatsApp Alerts**: Home seekers can subscribe to customized filter criteria and receive WhatsApp alerts when matching properties are listed.
9. **Printable "TO LET" Gate Poster**: Auto-generates a single-page A4 gate poster with dynamic QR code so street passers-by can scan and view virtual photos directly.
10. **Side-by-Side Property Comparison Matrix**: Shortlist and compare up to 3 properties side-by-side.
11. **Free Tenant SEO Tools**:
    - **HRA Rent Receipt Generator** (Section 10(13A) compliance with printable rent receipt layout).
    - **Gujarat 11-Month Rental Agreement Generator** (residential lease agreement ready for print or stamp paper).
    - **Move-in Photo Inspection ("Deposit Shield")** (room-by-room condition logger to protect tenant security deposits from unfair deductions).
12. **Role-Tailored User Dashboard (`/dashboard`) & Quick Shortcuts**:
    - Quick Menu Shortcuts bar tailored for **Tenant**, **Owner**, **Broker**, and **Admin** workflows.
    - Saved Wishlist tab, My Listings CRUD (with soft delete), Scheduled Visit Pass controls (Owner Approve/Decline, Tenant Cancel), and self-service **Deactivate Account** (soft delete).
    - **Dev/Demo Persona Switcher**: Instant switching between roles in development (`ENABLE_DEMO_MODE=true` / Dev OTP `123456`); disabled automatically in `NODE_ENV=production`.
13. **Progressive Web App (PWA)**: Web manifest and mobile standalone configuration ready for "Add to Home Screen".
14. **SEO & Discoverability Architecture**:
    - Crawlable public landing & tool routes (`/`, `/tools/hra-calculator`, `/tools/rental-agreement`, `/tools/move-in-checklist`, `/privacy-policy`, `/terms`) with login-gated property listings & details (`/explore`, `/roommates`, `/property/:idOrSlug` and `GET /api/v1/properties*`) and `noindex, nofollow` on auth/private dashboards.
    - Dynamic per-page `<title>`, meta descriptions, canonical URLs (`VITE_SITE_URL`), Open Graph / Twitter Cards, and Schema.org JSON-LD (`Organization`, `WebSite`, `CollectionPage`/`ItemList`, `RealEstateListing`, `WebApplication`) via `client/src/components/Seo.jsx`.
    - `robots.txt` and `/sitemap.xml` serving publicly crawlable routes (`server/controllers/seoController.js`, proxied in `client/nginx.conf`).
15. **Google Analytics 4 (GA4) Page & Activity Tracking**:
    - `gtag.js` (`G-LLWCM48NRV`) loaded in `client/index.html` with SPA route `page_view` tracking in `client/src/App.jsx` and central helper in `client/src/utils/analytics.js` (no PII sent).
    - **Tracked Activity Events**:
      - *Discovery*: `search`, `select_city`
      - *Listing Engagement*: `view_item`, `add_to_wishlist`, `remove_from_wishlist`, `compare_property`, `print_tolet_poster`
      - *Lead Conversions (recommended GA4 Key Events)*: `book_visit`, `contact_owner` (`whatsapp` / `in_app_chat`), `create_saved_search`
      - *Tools*: `calculate_hra`, `generate_rental_agreement`, `save_move_in_checklist`, `print_document`
      - *Auth & Supply*: `sign_up`, `login`, `switch_role`, `post_property`, `submit_kyc`
16. **Security, Privacy & Soft-Delete Hardening**:
    - **Soft Delete Everywhere**: Deleting properties (`DELETE /api/v1/properties/:id`), saved searches (`DELETE /api/v1/searches/:id`), or user accounts (`DELETE /api/v1/auth/me` or Admin user delete) sets `isDeleted: true` + `deletedAt`, cascades unlisting, revokes JWTs, and supports clean re-registration.
    - **API, Chat & Upload Security**: `helmet` headers, auth rate limiting, `express-mongo-sanitize`, strict CORS allowlist, `HttpOnly` auth cookies + `401` auto-logout sync, participant-verified Chat REST & Socket.io rooms, owner-restricted Visit status approvals, authenticated MIME-checked image uploads with `nosniff`, and authenticated deduplicated scam reports.
    - **Privacy & DPDP Compliance**: KYC documents/consumer numbers hidden from non-owners, `contactPreference: 'verified_only'` phone masking, `/privacy-policy`, `/terms`, and analytics `ConsentBanner`.

---

## 📊 Analytics & SEO Environment Notes
- Set `VITE_SITE_URL` (client build) and `CLIENT_URL` (server `.env`) to your production domain so canonical tags, `robots.txt`, and `sitemap.xml` reflect your live URL.
- View real-time and historical events in **Google Analytics → Reports → Realtime** and **Engagement → Events**, and mark `book_visit`, `contact_owner`, `sign_up`, and `post_property` as **Key Events**.

---

## 📋 Required Subscriptions & Deployment Checklist
For production deployment, see **Section 11 in [PLAN.md](PLAN.md)** for the complete guide to cloud credentials and deployment to Vercel and Render.
