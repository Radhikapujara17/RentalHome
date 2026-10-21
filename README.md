# 🏠 RentNest — Production-Ready Rental Home Platform (Rajkot, Gujarat)

> **Transparent, high-trust rental property marketplace eliminating ghost broker ads, hidden sub-meter electricity tariffs, and deposit disputes.**

---

## ⚡ Tech Stack & Production Architecture

- **Backend**: Node.js v20+, Express.js, MongoDB (Mongoose 8), Socket.io (Real-Time WebSockets), Multer + Cloudinary CDN, JWT Authentication (Phone OTP + Role RBAC)
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

1. **Split-Screen Map Discovery**: Interactive Leaflet Map with Rajkot price pins (`₹16.5k`, `₹24k`) synchronized with scrollable property cards.
2. **Living Reality Transparency Hub**:
   - Explicit declaration of **PGVCL Government Meter** (bill rate) vs **Sub-meter** (fixed ₹/kWh rate).
   - Water supply reality: **24/7 Continuous** vs scheduled municipal corporation timings.
   - Dietary & Cultural rules: **Pure Vegetarian Only** vs Any.
3. **Interactive Living Cost Estimator**: Tenant can adjust monthly expected electricity consumption units to see total monthly outflow (*Rent + Maintenance + Electricity + Water*).
4. **Roommates & Flatmate Sharing Marketplace (`/roommates`)**: Dedicated section for students & young working professionals with gender filters (Female Only / Male Only), budget filters, and direct WhatsApp contact.
5. **Real-Time In-App Chat & Anti-Fraud Guard**: Socket.io live chat drawer between tenants and landlords with security warnings against advance money transfers.
6. **Owner KYC Verification & Admin Operations Desk (`/admin`)**:
   - Landlords upload electricity bills (PGVCL) or property tax receipts to earn the green **"Verified Owner"** badge.
   - Operations desk for Admin to inspect documents, approve badges, view live metrics, and moderate listings.
7. **Direct Cloudinary Image Upload**: Drag-and-drop image uploader in the Post Property wizard and KYC modal uploading directly to Cloudinary CDN with fallback resilience.
8. **Save Search & Instant WhatsApp Alerts**: Home seekers can subscribe to customized filter criteria and receive WhatsApp alerts when matching properties are listed.
9. **Printable "TO LET" Gate Poster**: Auto-generates an A4 gate poster with dynamic QR code so street passers-by can scan and view virtual photos directly.
10. **Side-by-Side Property Comparison Matrix**: Shortlist and compare up to 3 properties side-by-side.
11. **Free Tenant SEO Tools**:
    - **HRA Rent Receipt Generator** (Section 10(13A) compliance with 12 monthly printable receipts).
    - **Gujarat 11-Month Rental Agreement Generator** (bilingual residential lease agreement ready for print or stamp paper).
    - **Move-in Photo Inspection ("Deposit Shield")** (room-by-room condition logger to protect tenant security deposits from unfair deductions).
12. **1-Click Demo Persona Switcher**: Instant switching between **Tenant**, **Direct Owner**, **Broker**, and **Admin** (with Dev OTP `123456`).
13. **Progressive Web App (PWA)**: Web manifest and mobile standalone configuration ready for "Add to Home Screen".

---

## 📋 Required Subscriptions & Deployment Checklist
For production deployment, see **Section 11 in [PLAN.md](PLAN.md)** for the complete guide to cloud credentials and deployment to Vercel and Render.
