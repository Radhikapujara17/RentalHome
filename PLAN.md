# 🏗️ RentNest — Full-Stack MERN Implementation Master Plan
> **Master Technical Blueprint for Web Application Development**  
> **Tech Stack**: React 18, Node.js LTS v20, Express 4, MongoDB (Mongoose 8), Tailwind CSS, Socket.io  
> **Target Market**: Urban Rental Platform (Rajkot, Gujarat launchpad)  
> **Document Status**: Production Ready Architecture Specification

---

## 📑 Table of Contents
1. [Executive Architecture & Web-First Strategy](#1-executive-architecture--web-first-strategy)
2. [Technology Stack & Exact Package Versions](#2-technology-stack--exact-package-versions)
3. [Third-Party Services, Subscriptions & Cost Matrix](#3-third-party-services-subscriptions--cost-matrix)
4. [Authentication, Security, Roles & Permissions](#4-authentication-security-roles--permissions)
5. [Complete Environment Variables Specification (.env)](#5-complete-environment-variables-specification-env)
6. [Complete Database Schema Architecture (Mongoose Models)](#6-complete-database-schema-architecture-mongoose-models)
7. [Detailed Feature-by-Feature Engineering Specifications](#7-detailed-feature-by-feature-engineering-specifications)
   - [Feature 1: Auth, Roles & KYC Verification](#feature-1-user-authentication-roles--profile-kyc)
   - [Feature 2: Multi-Step Property Listing Wizard](#feature-2-multi-step-property-listing-wizard-ownerbroker)
   - [Feature 3: Comprehensive Search, Split-Screen Map & Advanced Filters](#feature-3-search-engine-split-screen-map--deep-filters)
   - [Feature 4: Roommate & Flatmate Sharing Marketplace](#feature-4-roommate--flatmate-sharing-marketplace)
   - [Feature 5: Property Details Transparency Hub & Living Cost Calculator](#feature-5-property-details-transparency-hub--cost-calculator)
   - [Feature 6: Multi-Property Shortlist & Side-by-Side Comparison](#feature-6-shortlist--multi-property-comparison-tool)
   - [Feature 7: Direct WhatsApp Lead Generation & Call Privacy](#feature-7-direct-whatsapp-lead-generation--call-privacy-shield)
   - [Feature 8: Real-Time In-App Chat with Anti-Fraud Guard](#feature-8-real-time-in-app-messaging-engine-socketio)
   - [Feature 9: Calendar Visit Scheduling & Digital Visit Pass](#feature-9-calendar-visit-scheduling--digital-visit-pass)
   - [Feature 10: Printable "TO LET" Signboard with Dynamic QR Code](#feature-10-printable-to-let-signboard--qr-code-generator)
   - [Feature 11: 21-Day WhatsApp Freshness Bot & Inventory Manager](#feature-11-automated-21-day-listing-freshness-bot)
   - [Feature 12: Trust & Safety: Verified Badges & Anti-Broker Detection](#feature-12-trust--safety-verified-badges--anti-broker-engine)
   - [Feature 13: Digital Move-In Photo Checklist (Deposit Shield)](#feature-13-digital-move-in-photo-condition-checklist)
   - [Feature 14: Free 1-Click HRA Rent Receipt Generator (SEO Magnet)](#feature-14-free-hra-rent-receipt-generator-seo-hook)
   - [Feature 15: Gujarat 11-Month Rental Agreement Generator](#feature-15-gujarat-standard-11-month-bilingual-rental-agreement)
   - [Feature 16: Admin Operations Dashboard & Locality Price Analytics](#feature-16-admin-operations-dashboard--analytics)
   - [Feature 17: SEO Optimization, WhatsApp Rich OpenGraph Cards & PWA](#feature-17-seo-whatsapp-opengraph-rich-cards--pwa-layer)
8. [Production Folder & Codebase Structure](#8-production-folder--codebase-structure)
9. [Development Roadmap & Phased Execution Plan](#9-development-roadmap--phased-execution-plan)
10. [Local Development, Deployment & CI/CD Guide](#10-local-development-deployment--cicd-guide)
11. [Required Subscriptions, API Keys & Environment Secrets Checklist](#11-required-subscriptions-api-keys--environment-secrets-checklist)
12. [Master Technical Architecture for All Strategic Suggestions](#12-master-technical-architecture-for-all-strategic-suggestions)

---

## 1. Executive Architecture & Web-First Strategy

RentNest is designed with a **Web-First, Client-Server architecture** utilizing the **MERN (MongoDB, Express.js, React, Node.js)** ecosystem.

```
                    +------------------------------------------+
                    |             Client Layer                 |
                    |   React 18 (Vite) + Tailwind CSS + PWA   |
                    |      Zustand Store + TanStack Query      |
                    +--------------------+---------------------+
                                         |
                       HTTP / REST API   |   WebSockets (WS)
                                         v
                    +------------------------------------------+
                    |             API Gateway / Node           |
                    |   Express.js REST APIs + Socket.io Server|
                    |   Auth Middleware (JWT) + Rate Limiters  |
                    +----+-------------------+---------------+--+
                         |                   |               |
                         v                   v               v
                +-----------------+  +---------------+  +--------------+
                |  MongoDB Atlas  |  |  Cloudinary   |  |  WhatsApp /  |
                |  (Mongoose 8)   |  | (Image CDN &  |  | Twilio Cloud |
                |  ACID DB Layer  |  |  Watermarks)  |  | Notifications|
                +-----------------+  +---------------+  +--------------+
```

### Why Web-First Over Native App
1. **Zero-friction discovery**: Potential tenants browsing Kalawad Road or University Road listings do not want to download a 60MB app to view one flat. Web links open instantly.
2. **Google SEO domination**: Dedicated locality pages (`/rent/rajkot/kalawad-road/2-bhk`) rank organically for high-intent searches.
3. **Physical-to-Digital Onboarding**: Passers-by scan a printed gate QR code that immediately launches the browser with high-resolution photos.
4. **PWA capability**: Users can click "Add to Home Screen" on Chrome/Safari to get a full-screen, native-app feel with push alerts.

---

## 2. Technology Stack & Exact Package Versions

### 2.1 Backend Dependencies (`server/package.json`)
```json
{
  "name": "rentnest-server",
  "version": "1.0.0",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.7.0",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.15",
    "pdfkit": "^0.15.0",
    "qrcode": "^1.5.4",
    "sharp": "^0.33.5",
    "socket.io": "^4.7.5",
    "twilio": "^5.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

### 2.2 Frontend Dependencies (`client/package.json`)
```json
{
  "name": "rentnest-client",
  "version": "1.0.0",
  "dependencies": {
    "@tanstack/react-query": "^5.56.2",
    "axios": "^1.7.7",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.2",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.447.0",
    "qrcode.react": "^3.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.2.3",
    "react-helmet-async": "^2.0.5",
    "react-hot-toast": "^2.4.1",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^6.26.2",
    "socket.io-client": "^4.7.5",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.12",
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8",
    "vite-plugin-pwa": "^0.20.5"
  }
}
```

---

## 3. Third-Party Services, Subscriptions & Cost Matrix

| Service | Purpose | Plan / Subscription Tier | Cost (Development / MVP) | Cost (Production at Scale) | How to Get Credentials |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MongoDB Atlas** | Managed Cloud NoSQL Database | **M0 Sandbox** (Free Tier - 512MB storage, shared RAM) | **$0 / month** | $9 - $57/mo (M10 dedicated when > 10,000 listings) | [cloud.mongodb.com](https://cloud.mongodb.com) -> Create Cluster -> Database Access -> Connection String |
| **Cloudinary** | Image/Video hosting, dynamic watermarking, auto-compression | **Free Tier** (25 Monthly Credits, ~25GB storage/bandwidth) | **$0 / month** | $89/mo (Plus plan when > 50k visitors/mo) | [cloudinary.com](https://cloudinary.com) -> Dashboard -> Cloud Name, API Key, API Secret |
| **Meta WhatsApp Cloud API / Twilio** | Instant WhatsApp Lead Gen, Freshness Bot, Alerts | **WhatsApp Cloud API** (Meta Dev: 1,000 free service convos/month)<br>*Or* Twilio WhatsApp Sandbox | **$0 / month** (Dev sandbox / free quota) | ~$0.005 - $0.009 per marketing/service conversation | [developers.facebook.com](https://developers.facebook.com) or [twilio.com](https://twilio.com) -> WhatsApp Sandbox |
| **OpenStreetMap & Leaflet** | Interactive map pins, split screen search | **Open-source Tiles** (CartoDB / OSM default) | **$0 / month** (No credit card required) | Free with standard attribution | No API key needed for basic OSM tiles |
| **Google Maps Embed / Places (Optional)** | Address autocomplete & street directions | **Google Cloud Platform (GCP)** $200 free monthly credit | **$0 / month** (Under $200 free allowance) | Pay-as-you-go after $200 credit | [console.cloud.google.com](https://console.cloud.google.com) -> APIs & Services -> Maps JS API & Places API |
| **Resend / Nodemailer (Email)** | Email OTP, visit alerts, verification updates | **Resend Free Tier** (3,000 emails/month, 100/day) *or* Gmail SMTP | **$0 / month** | $20/mo (Pro: 50,000 emails/mo) | [resend.com](https://resend.com) -> API Keys *or* Google App Passwords |
| **Vercel** | Web Frontend Hosting (React Vite PWA) | **Hobby Tier** (Free personal plan, auto SSL, CDN) | **$0 / month** | $20/seat/mo (Pro tier for commercial team) | [vercel.com](https://vercel.com) -> Import Git repo |
| **Render / Railway** | Node.js Backend & Socket.io WebSockets | **Render Free Web Service** *or* Railway $5 Starter | **$0 - $5 / month** | $7 - $25/mo (Standard instance with persistent WebSocket) | [render.com](https://render.com) or [railway.app](https://railway.app) |

---

## 4. Authentication, Security, Roles & Permissions

### 4.1 Supported Roles
1. **`tenant`**: Default persona. Can search, save listings, submit chat messages, request visits, generate HRA receipts, and compare flats.
2. **`owner`**: Direct landlord. Can post properties, manage inventory, download TO LET posters, verify ownership via electricity bill, and accept/reject visits.
3. **`broker`**: Real estate agent. Has clear broker tag, must state brokerage terms upfront (e.g., 15 days / 1 month rent), and manages multi-unit inventory.
4. **`admin`**: Platform operations. Can review KYC/electricity bills, approve verification badges, quarantine scam listings, and view locality price metrics.

### 4.2 Authentication Flow (Phone OTP + Email/Password + Google OAuth)
* **Primary Auth (Indian market standard)**: Phone Number + 6-digit OTP (generated via `crypto.randomInt(100000, 999999)`, valid for 5 minutes). In development, fallback OTP is enabled (`123456`).
* **Secondary Auth**: Email + Password with `bcryptjs` (salt rounds: 12).
* **JWT Tokens**:
  * **Access Token**: Short-lived (15 minutes), sent in HTTP headers `Authorization: Bearer <token>`.
  * **Refresh Token**: Long-lived (7 days), stored in secure `httpOnly`, `SameSite=Strict`, `Secure` cookie.
* **Role-Based Access Control (RBAC)**: Custom Express middleware `authorize(['owner', 'admin'])`.

---

## 5. Complete Environment Variables Specification (.env)

### 5.1 Backend Environment Configuration (`server/.env`)
```bash
# ==========================================
# SERVER RUNTIME CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# ==========================================
# MONGODB CONNECTION
# Get from: MongoDB Atlas -> Clusters -> Connect -> Drivers
# ==========================================
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/rentnest?retryWrites=true&w=majority

# ==========================================
# AUTHENTICATION & JWT SECRETS
# Generate strong secrets: openssl rand -base64 32
# ==========================================
JWT_SECRET=rentnest_super_secret_jwt_access_key_2026_xyz987
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=rentnest_super_secret_jwt_refresh_key_2026_abc123
JWT_REFRESH_EXPIRE=7d

# ==========================================
# CLOUDINARY (MEDIA & WATERMARKING)
# Get from: https://cloudinary.com/console
# ==========================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=rentnest_production

# ==========================================
# WHATSAPP & SMS NOTIFICATIONS (TWILIO / GUPSHUP)
# Get from: https://console.twilio.com
# ==========================================
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
USE_DEV_OTP=true
DEV_OTP_CODE=123456

# ==========================================
# TRANSACTIONAL EMAIL (RESEND OR NODEMAILER SMTP)
# ==========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM="RentNest Team <no-reply@rentnest.in>"

# ==========================================
# DEFAULT ADMIN CREDENTIALS (FOR SEEDING)
# ==========================================
ADMIN_NAME="RentNest SuperAdmin"
ADMIN_EMAIL=admin@rentnest.in
ADMIN_PHONE=+919876543210
ADMIN_PASSWORD=AdminSecurePassword@2026
```

### 5.2 Frontend Environment Configuration (`client/.env`)
```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api/v1

# WebSocket Server URL
VITE_SOCKET_URL=http://localhost:5000

# Optional Google Maps Key (if replacing OpenStreetMap)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-PlaceholderKeyForGoogleMaps

# Default City & Coordinates (Rajkot, Gujarat)
VITE_DEFAULT_CITY=Rajkot
VITE_DEFAULT_LAT=22.3039
VITE_DEFAULT_LNG=70.8022

# App Configuration
VITE_APP_NAME="RentNest"
VITE_SUPPORT_WHATSAPP=+919876543210
```

---

## 6. Complete Database Schema Architecture (Mongoose Models)

```
                       +-------------------+
                       |       User        |
                       +---------+---------+
                                 | 1
                                 |
         +-----------------------+-----------------------+
         | 1:N                   | 1:N                   | 1:N
         v                       v                       v
+--------+--------+     +--------+--------+     +--------+--------+
|    Property     |     |  SavedSearch    |     |   VisitRequest  |
+--------+--------+     +-----------------+     +-----------------+
         | 1
         |
    +----+----+-------------------------+
    | 1:N     | 1:N                     | 1:N
    v         v                         v
+---+---+ +---+---+             +-------+-------+
|Message| |Report |             |MoveInChecklist|
+-------+ +-------+             +---------------+
```

### 6.1 `User` Schema (`server/models/User.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  password: { type: String, select: false },
  role: { 
    type: String, 
    enum: ['tenant', 'owner', 'broker', 'admin'], 
    default: 'tenant' 
  },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  
  // Broker specific details
  brokerDetails: {
    agencyName: String,
    brokerageTerms: { type: String, default: '15 Days Rent' }, // e.g. "15 Days Rent", "1 Month Rent"
    licenseNumber: String,
    experienceYears: Number
  },

  // Owner KYC verification
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  kycDocumentUrl: String,
  kycDocumentType: { type: String, enum: ['electricity_bill', 'property_tax', 'index_copy'] },
  kycSubmittedAt: Date,
  kycVerifiedAt: Date,

  // Contact preferences
  contactPreference: {
    type: String,
    enum: ['all', 'verified_only', 'whatsapp_only'],
    default: 'all'
  },

  // Anti-Broker Guard (counts distinct societies posted by owner)
  distinctSocietiesCount: { type: Number, default: 0 },
  isFlaggedAsBroker: { type: Boolean, default: false },

  // OTP Management
  otpCode: String,
  otpExpiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### 6.2 `Property` Schema (`server/models/Property.js`)
```javascript
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  listingNumber: { type: String, unique: true, index: true }, // e.g., RN-1042
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Categorization
  propertyType: { 
    type: String, 
    enum: ['flat', 'independent_house', 'row_house', 'penthouse', 'pg_coliving', 'shared_room'],
    required: true 
  },
  bhk: { type: String, enum: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'], required: true },
  carpetAreaSqFt: { type: Number, required: true },
  floorNumber: { type: Number, default: 0 },
  totalFloors: { type: Number, default: 1 },
  facing: { type: String, enum: ['East', 'North-East', 'North', 'West', 'South', 'Other'], default: 'East' },

  // Location Details
  locality: { type: String, required: true, index: true }, // e.g., "Kalawad Road"
  societyName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  landmark: String,
  distanceToKeyLandmarks: [{
    name: String, // e.g. "Crystal Mall", "AIIMS Rajkot", "BRTS Bus Stop"
    distanceKm: Number
  }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  // Transparent Financials (Zero Hidden Costs)
  pricing: {
    monthlyRent: { type: Number, required: true, index: true },
    securityDeposit: { type: Number, required: true },
    depositMonths: { type: Number, default: 2 },
    maintenanceAmount: { type: Number, default: 0 },
    isMaintenanceIncluded: { type: Boolean, default: false },
    brokerageAmount: { type: Number, default: 0 },
    lockInPeriodMonths: { type: Number, default: 6 },
    noticePeriodDays: { type: Number, default: 30 }
  },

  // Real Living Reality: Electricity & Water
  utilities: {
    electricityMeterType: { 
      type: String, 
      enum: ['direct_govt_pgvcl', 'sub_meter'], 
      default: 'direct_govt_pgvcl' 
    },
    subMeterUnitRate: { type: Number, default: 0 }, // e.g., ₹10/unit
    waterSupplyType: { 
      type: String, 
      enum: ['24_7_continuous', 'scheduled_municipal', 'tanker_dependent'],
      default: '24_7_continuous'
    },
    waterScheduleHours: { type: String, default: '24 Hours' }, // e.g., "1 Hour Morning (7-8 AM)"
    waterSource: { 
      type: [String], 
      enum: ['Municipal RMC/Narmada', 'Borewell', 'Water Tanker'] 
    },
    drinkingWaterRo: { type: Boolean, default: true },
    pipedGasAvailable: { type: Boolean, default: false },
    fiberInternetPreWired: { type: Boolean, default: true }
  },

  // House Rules & Living Culture
  rules: {
    allowedTenants: { 
      type: String, 
      enum: ['Family Only', 'Bachelors (Male)', 'Bachelors (Female)', 'Working Professionals Only', 'Any'],
      default: 'Any'
    },
    foodPreference: { 
      type: String, 
      enum: ['Pure Vegetarian Only', 'Vegetarian / Jain Preferred', 'Non-Veg Allowed'], 
      default: 'Pure Vegetarian Only' 
    },
    gateCurfew: { 
      type: String, 
      enum: ['24/7 Open / Self-Key Access', 'Gate Locked at 10:30 PM', 'Gate Locked at 11:00 PM'], 
      default: '24/7 Open / Self-Key Access' 
    },
    visitorsAllowed: { type: Boolean, default: true },
    petsAllowed: { type: Boolean, default: false }
  },

  // Amenities & Furnishing
  furnishingStatus: { 
    type: String, 
    enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'], 
    default: 'Semi-Furnished' 
  },
  furnishingItems: [String], // ["AC", "Double Bed", "Sofa", "Washing Machine", "Geyser", "Wardrobe", "Fridge"]
  amenities: [String], // ["Covered 4W Parking", "Lift with Backup", "CCTV Security Guard", "Balcony", "Private Terrace"]

  // Media
  photos: [{
    url: { type: String, required: true },
    publicId: String,
    roomTag: { 
      type: String, 
      enum: ['Living Room', 'Master Bedroom', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Exterior / Entrance', 'Parking'] 
    },
    isCoverPhoto: { type: Boolean, default: false }
  }],
  videoTourUrl: String, // YouTube or Vimeo link

  // Listing Status & Freshness
  status: { 
    type: String, 
    enum: ['active', 'rented', 'unlisted', 'quarantined'], 
    default: 'active',
    index: true
  },
  isVerifiedOwner: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  shortlistCount: { type: Number, default: 0 },
  lastFreshnessConfirmedAt: { type: Date, default: Date.now },
  freshnessReminderCount: { type: Number, default: 0 },

  // Anti-scam Moderation
  reportCount: { type: Number, default: 0 },
  isQuarantined: { type: Boolean, default: false }
}, { timestamps: true });

// Geo-index for distance & boundary queries
propertySchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });
propertySchema.index({ "pricing.monthlyRent": 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);
```

### 6.3 `VisitRequest` Schema (`server/models/VisitRequest.js`)
```javascript
const mongoose = require('mongoose');

const visitRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  preferredDate: { type: Date, required: true },
  timeSlot: { 
    type: String, 
    enum: ['Morning: 10:00 AM - 12:00 PM', 'Afternoon: 02:00 PM - 04:00 PM', 'Evening: 05:00 PM - 07:00 PM'], 
    required: true 
  },
  tenantNote: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rescheduled', 'declined', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  ownerCounterDate: Date,
  ownerCounterSlot: String,
  visitPassCode: { type: String, unique: true }, // e.g., VP-9021
  
  // Post-visit feedback
  feedbackCompleted: { type: Boolean, default: false },
  didTenantVisit: Boolean,
  propertyAsDescribedRating: { type: Number, min: 1, max: 5 },
  feedbackComments: String
}, { timestamps: true });

module.exports = mongoose.model('VisitRequest', visitRequestSchema);
```

### 6.4 `Message` & `Conversation` Schemas (`server/models/Chat.js`)
```javascript
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: Date
}, { timestamps: true });

module.exports = {
  Conversation: mongoose.model('Conversation', conversationSchema),
  Message: mongoose.model('Message', messageSchema)
};
```

### 6.5 `SavedSearch` Schema (`server/models/SavedSearch.js`)
```javascript
const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  criteria: {
    locality: [String],
    bhk: [String],
    minPrice: Number,
    maxPrice: Number,
    waterSupplyType: String,
    foodPreference: String,
    zeroBrokerageOnly: Boolean
  },
  alertChannels: {
    whatsapp: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    webPush: { type: Boolean, default: true }
  },
  lastNotifiedListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, { timestamps: true });

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
```

### 6.6 `MoveInChecklist` Schema (`server/models/MoveInChecklist.js`)
```javascript
const mongoose = require('mongoose');

const moveInChecklistSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inspectionDate: { type: Date, default: Date.now },
  rooms: [{
    roomName: { type: String, required: true }, // e.g. "Living Room", "Master Bath"
    itemsCondition: [{
      item: String, // "Wall Paint", "Tiles", "AC Cooling", "Switchboard"
      status: { type: String, enum: ['Excellent', 'Good', 'Scratched/Stained', 'Damaged'] },
      remarks: String,
      photos: [String] // Cloudinary URLs with timestamp
    }]
  }],
  isTenantSigned: { type: Boolean, default: false },
  isOwnerSigned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MoveInChecklist', moveInChecklistSchema);
```

---

## 7. Detailed Feature-by-Feature Engineering Specifications

---

### Feature 1: User Authentication, Roles & Profile KYC
* **Objective**: Frictionless onboarding using Indian mobile numbers with SMS/WhatsApp OTP, role switching (Tenant vs Owner vs Broker), and KYC document verification.
* **Frontend Components**:
  - `src/components/auth/AuthModal.jsx`: Tabs for "Phone OTP", "Email Login", and "Sign Up".
  - `src/components/auth/OtpInput.jsx`: 6-box auto-focus OTP entry with 60-second resend countdown.
  - `src/pages/OwnerKycPage.jsx`: Document dropzone for PGVCL electricity bill or Municipal tax receipt with status banner (*Under Review / Verified*).
* **Backend Implementation**:
  - `POST /api/v1/auth/send-otp`: Generates 6-digit OTP, saves in `User` record with 5-minute expiry, dispatches via Twilio SMS or returns code if `NODE_ENV === 'development'`.
  - `POST /api/v1/auth/verify-otp`: Validates OTP code, issues signed JWT access token and sets HTTP-only refresh cookie.
  - `POST /api/v1/auth/kyc-upload`: Uses `multer` and `cloudinary` to store document securely in a private bucket, sets `verificationStatus: 'pending'`.
* **Database Updates**: `User` collection schema as detailed in Section 6.1.
* **Keys & Secrets**: `JWT_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `CLOUDINARY_API_KEY`.
* **Edge Cases**: Prevent brute force attacks with `express-rate-limit` (max 5 OTP attempts per 15 mins per IP/phone).

---

### Feature 2: Multi-Step Property Listing Wizard (Owner/Broker)
* **Objective**: Guide landlords and brokers to list a property in under 4 minutes with zero omitted details (rent, deposit, sub-meter, water timing, curfew, room-tagged photos).
* **Frontend Components**:
  - `src/pages/PostPropertyPage.jsx`: 7-step wizard with persistent draft in `localStorage`.
    - *Step 1: Basic Info* (Property Type, BHK, Society, Locality dropdown with 25+ Rajkot zones).
    - *Step 2: Transparent Financials* (Rent, Security deposit months, Maintenance included/extra, PGVCL vs Sub-meter unit price).
    - *Step 3: Dimensions & Furnishing* (Sq Ft, floor number, itemized furnishing checkboxes).
    - *Step 4: Water & Daily Utilities* (24/7 vs Scheduled hours, RMC/Borewell source, RO purifier).
    - *Step 5: Living Culture & Rules* (Veg Only / Jain preferred, 24/7 Gate entry vs 10:30 PM curfew, Visitors allowed).
    - *Step 6: Photos & Room Tagging* (Drag-and-drop cover photo, room category selector per picture).
    - *Step 7: Contact Privacy* (Show phone to all / Verified tenants only / WhatsApp chat only).
* **Backend Implementation**:
  - `POST /api/v1/properties`: Validates payload using `express-validator`. Generates unique `listingNumber` (`RN-XXXX`) and SEO-friendly slug (`2-bhk-kalawad-road-rajkot-rn-1042`).
  - Auto-watermarking via Cloudinary transformations: attaches a subtle `"RentNest Verified"` text overlay on upload.
* **Anti-Broker Guard**: If an owner account posts listings in more than 2 distinct societies, the server triggers a warning flag requiring agent verification.
* **Database Models**: `Property` model (Section 6.2).

---

### Feature 3: Search Engine, Split-Screen Map & Deep Filters
* **Objective**: Instant search tailored to local urban realities with Airbnb/Zillow-style desktop split screen and mobile list/map switch.
* **Frontend Components**:
  - `src/pages/SearchPage.jsx`: Left pane interactive Leaflet map with price markers (`₹14k`), right pane responsive property grid.
  - `src/components/search/FilterDrawer.jsx`:
    - Locality multi-select (Kalawad Road, 150 Ft Ring Road, University Road, Nana Mava, Mavdi, Raiya Road, etc.).
    - Price range slider (₹4,000 to ₹75,000+).
    - **No Brokerage Toggle** (Owners Only).
    - **PGVCL Govt Meter Only** toggle.
    - **24/7 Continuous Water** toggle.
    - **Pure Vegetarian Only** filter badge.
    - **24/7 Gate Access (No Curfew)** filter badge.
* **Backend Implementation**:
  - `GET /api/v1/properties/search`: Dynamic MongoDB aggregation pipeline:
    - Builds dynamic `$match` query for `locality`, `pricing.monthlyRent`, `bhk`, `utilities.electricityMeterType`, `utilities.waterSupplyType`, and `rules.foodPreference`.
    - Handles pagination (`skip`, `limit`), sorting (`price_asc`, `price_desc`, `newest`, `verified_first`).
    - Distance querying via `$geoWithin` / `$nearSphere` when landmark radius is active.
* **APIs & Free Subscriptions**: OpenStreetMap tiles with `react-leaflet` (zero cost, unlimited queries).

---

### Feature 4: Roommate & Flatmate Sharing Marketplace
* **Objective**: Help students (e.g. Saurashtra Univ, RK Univ, AIIMS) and young working professionals find shared rooms with verified co-living partners.
* **Frontend Components**:
  - `src/pages/RoommatesPage.jsx`: Grid of flatmate requests with gender badges (*Female Flatmate Required*), budget per head (e.g. ₹4,500/mo), profession tag (*Doctor / IT / Student*), and move-in date.
  - `src/components/roommate/PostRoommateModal.jsx`: 2-step modal to post an open room in an existing flat.
* **Backend Implementation**:
  - Endpoints: `GET /api/v1/roommates` and `POST /api/v1/roommates`.
  - Filters by gender preference, food habits, and college/work proximity.

---

### Feature 5: Property Details Transparency Hub & Cost Calculator
* **Objective**: Remove all ambiguities before physical visits. Displays high-resolution gallery, interactive total living cost calculator, daily factsheet, and safety notices.
* **Frontend Components**:
  - `src/pages/PropertyDetailPage.jsx`:
    - **Photo Carousel**: Zoomable room-categorized gallery with video walkthrough embed.
    - **Total Outflow Calculator Box**:
      - Monthly Rent: `₹14,000`
      - Security Deposit: `₹28,000` (2 Months - Refundable)
      - Maintenance: `₹1,000`
      - Estimated Electricity: `₹1,200` (Direct PGVCL Govt Meter)
      - Brokerage: `₹0` (Direct Owner)
      - **Estimated Day-1 Move-in Budget**: `₹43,000`
    - **Living Factsheet**: Water schedule details, parking slot allotment, broadband fiber readiness.
    - **House Rules Badges**: Pure Veg, Gate curfew hours, Pet policy.
    - **Action Buttons Bar**: Floating mobile footer with "Chat on WhatsApp", "Call Owner", and "Schedule Visit".
* **Backend Implementation**:
  - `GET /api/v1/properties/:slug`: Increments `viewCount`, populates owner details (filtering phone according to owner's `contactPreference` settings).
* **SEO & WhatsApp Previews**: Dynamic OpenGraph meta tags via `react-helmet-async` (renders title, price, BHK, and cover photo when shared on WhatsApp).

---

### Feature 6: Shortlist, Multi-Property Comparison & Cloud Wishlist Architecture
* **Objective**: Allow prospective tenants to bookmark homes into a persistent Wishlist and compare up to 3 selected properties side-by-side on critical living metrics with AI best-fit recommendations.

#### 6.1 Database Schema Architecture
```javascript
// User Schema Extension (server/models/User.js)
userSchema.add({
  savedProperties: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property',
    index: true 
  }],
  activeComparisonList: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }]
});
```

#### 6.2 Wishlist & Comparison API Specifications
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/properties/:id/save` | Private | Toggle property in user's saved wishlist in MongoDB |
| `GET` | `/api/v1/properties/my/saved` | Private | Retrieve all bookmarked properties with full populated details |
| `PUT` | `/api/v1/properties/my/comparison` | Private | Sync and persist current comparison list in user's MongoDB record |
| `GET` | `/api/v1/properties/compare-shared` | Public | Load shared comparison by array of property IDs (`?ids=id1,id2,id3`) |

#### 6.3 Frontend Wishlist & Comparison Components
1. **`PropertyCard.jsx` Wishlist Button**:
   - Heart icon button on the top-right of every property card.
   - 1-click optimistic toggle with visual fill effect and `react-hot-toast` confirmation.
   - If user is not authenticated, opens the Login Modal without losing page context.
2. **`CompareModal.jsx` (Mobile-Responsive & AI-Powered)**:
   - Floating compare bar when `shortlist.length > 0`.
   - Responsive modal with horizontal table swipe for mobile devices (`max-h-[92vh] overflow-y-auto`).
   - **AI Best Fit Recommendation Banner**:
     - Calculates effective monthly outflow (rent + maintenance + utility estimate).
     - Ranks properties based on PGVCL meter, water stability, brokerage, and deposit terms.
     - Offers 3 AI lens presets: *Best Overall Value*, *Lowest Monthly Cost*, *Maximum Space*.
   - **Shareable WhatsApp Link**: Button to generate a shareable URL (`/compare?ids=...`) to discuss options with roommates or family.
3. **Dashboard "Saved Homes" Tab**:
   - Displays all bookmarked listings in a clean grid.
   - Features 1-click "Add to Compare", "Schedule Visit", and "Remove" actions.
   - Automated alerts if the landlord drops the rent or confirms availability.

---

### Feature 7: Direct WhatsApp Lead Generation & Call Privacy Shield
* **Objective**: Provide instant 1-tap WhatsApp connectivity while protecting landlord phone numbers from spam scrapers.
* **Frontend Implementation**:
  - `src/components/property/WhatsAppButton.jsx`: Formats pre-filled message:
    `https://wa.me/{ownerPhone}?text=Hi!%20I%20saw%20your%20{BHK}%20flat%20on%20RentNest%20(Listing%20#{ListingNumber})%20at%20{Locality}.%20Is%20it%20available%20for%20a%20visit?`
  - `src/components/property/CallOwnerButton.jsx`:
    - If `contactPreference === 'all'`: Directly triggers `tel:+91XXXXXXXXXX`.
    - If `contactPreference === 'verified_only'`: Checks if user is logged in and phone-verified; otherwise opens login modal.
    - If `contactPreference === 'whatsapp_only'`: Prompts user to use in-app chat or WhatsApp.
* **Backend Security**: Phone numbers are masked in general search JSON endpoints and only returned by `GET /api/v1/properties/:id/reveal-contact` after rate-limiting checks (prevents automated bot scraping).

---

### Feature 8: Real-Time In-App Messaging Engine (Socket.io)
* **Objective**: Secure, instant chat for users who wish to keep their personal phone numbers hidden during early negotiations.
* **Frontend Components**:
  - `src/pages/ChatPage.jsx`: Two-panel chat UI (conversations list on left, active message stream on right).
  - Quick-reply chips: *"Is rent negotiable?"*, *"Can I visit this Saturday?"*, *"Is car parking covered?"*.
  - Anti-Fraud Warning Banner at top: *"⚠️ Warning: Never pay any token or deposit before in-person inspection."*
* **Backend Implementation**:
  - `server/sockets/chatSocket.js`:
    - Handles `join_conversation`, `send_message`, `typing_indicator`, `message_read`.
    - Saves messages to MongoDB `Message` model and updates `lastMessageAt` on `Conversation`.
    - Emits real-time notification to the receiver's socket room.
* **Subscriptions & Scaling**: In-memory adapter for MVP; Redis Pub/Sub adapter ready for multi-server scaling.

---

### Feature 9: Calendar Visit Scheduling & Digital Visit Pass
* **Objective**: Eliminate endless phone back-and-forth by letting tenants request specific viewing slots with automated digital visit passes.
* **Workflow**:
  1. Tenant clicks "Schedule Visit", selects date and slot (Morning 10-12 / Afternoon 2-4 / Evening 5-7), and adds an optional note.
  2. Owner receives WhatsApp & In-App alert with 3 quick options: **Accept**, **Propose New Time**, or **Decline**.
  3. Upon acceptance, system generates a **Digital Visit Pass** (`VP-XXXX`) with Google Maps directions, landmark notes, and owner's direct contact.
  4. Node-cron sends an automated WhatsApp/SMS reminder 2 hours prior to the slot.
  5. Next morning, tenant receives a 1-tap feedback survey: *"Did you visit? Were photos accurate?"*.
* **Backend Endpoints**:
  - `POST /api/v1/visits/request`
  - `PATCH /api/v1/visits/:id/respond` (accept/decline/counter)
  - `POST /api/v1/visits/:id/feedback`
* **Database Model**: `VisitRequest` (Section 6.3).

---

### Feature 10: Printable "TO LET" Signboard & QR Code Generator
* **Objective**: Bridge offline foot-traffic discovery to online listings. Landlords print an A4 poster and paste it on their building gate.
* **Frontend Implementation**:
  - `src/components/property/PrintableToLetPoster.jsx`:
    - Large bold heading: **"TO LET / FOR RENT"**
    - Highlighting BHK, Society Name, Locality, and Furnishing status.
    - Large vector QR Code generated via `qrcode.react` pointing to `https://rentnest.in/p/{listingSlug}`.
    - Call to action: *"Scan with your phone camera to view interior photos, rent details, and contact owner directly"*.
  - 1-Click "Download Printable PDF" button utilizing `html2canvas` and `jspdf`.
* **Backend Alternative**: `GET /api/v1/properties/:id/poster-pdf` generates server-side high-res 300 DPI PDF using `pdfkit`.

---

### Feature 11: Automated 21-Day Listing Freshness Bot
* **Objective**: Eradicate "ghost" and already-rented listings. RentNest guarantees active, real inventory.
* **Automated Workflow**:
  1. `node-cron` runs every day at 10:00 AM UTC (`0 10 * * *`).
  2. Queries `Property.find({ status: 'active', lastFreshnessConfirmedAt: { $lt: 21_DAYS_AGO } })`.
  3. Sends automated WhatsApp message via Twilio/Gupshup:
     > *"RentNest Check: Is your 2 BHK flat at Kalawad Road still available for rent? Reply '1' for YES, or '2' for ALREADY RENTED."*
  4. WhatsApp Webhook endpoint (`POST /api/v1/webhooks/whatsapp`) parses landlord replies:
     - If "1": Updates `lastFreshnessConfirmedAt = Date.now()`.
     - If "2": Instantly updates `status = 'rented'`.
  5. If no response after 2 reminders (48 hours), the listing status automatically moves to `'unlisted'`.
* **Owner Dashboard**: Owners also have a 1-click **"Mark as Rented"** button on their property management panel to stop all incoming inquiries immediately.

---

### Feature 12: Trust & Safety: Verified Badges & Anti-Broker Engine
* **Objective**: Prevent broker impersonation and verify genuine direct landlords.
* **Owner Verification Engine**:
  - Landlord uploads PGVCL electricity bill or municipal tax receipt.
  - Admin dashboard displays side-by-side comparison of owner name, property address, and bill details.
  - Admin clicks "Approve" -> sets `Property.isVerifiedOwner = true` and `User.verificationStatus = 'verified'`.
  - Listing displays prominent green **"RentNest Verified Owner"** badge and receives ranking boost in search results.
* **Anti-Broker Impersonation Guard**:
  - Middleware checks `distinctSocietiesCount` on property creation.
  - If a user with role `owner` posts listings across more than 2 distinct societies, the system prevents further submissions and prompts them to convert their profile to a registered `broker` profile.
* **Community Scam Reporting**:
  - "Report Listing" modal with choices: *Broker posing as owner, Already rented, Fake photos, Advance payment demanded*.
  - Listings with $\ge 3$ reports are automatically quarantined (`isQuarantined: true`) pending admin moderation.

---

### Feature 13: Digital Move-In Photo Condition Checklist
* **Objective**: Protect tenant security deposits from unfair deductions when moving out.
* **Frontend Implementation**:
  - `src/pages/MoveInChecklistPage.jsx`: Room-by-room digital inspection sheet (Living Room, Bedrooms, Kitchen, Bathrooms).
  - Both Tenant and Owner upload timestamped photos of wall paint, floor tiles, switchboards, and AC working status on move-in day.
  - Digital sign-off toggle for both parties.
  - Downloadable PDF report serving as legal condition proof at lease termination.
* **Backend Endpoint**: `POST /api/v1/checklists`, `PATCH /api/v1/checklists/:id/sign`.
* **Storage**: Uploads saved to Cloudinary under folder `rentnest_checklists/`.

---

### Feature 14: Free HRA Rent Receipt Generator (SEO Hook)
* **Objective**: Free viral utility bringing thousands of organic Google search visitors monthly without paid advertising.
* **Frontend Implementation**:
  - `src/pages/HraReceiptGeneratorPage.jsx`:
    - Clean form: Tenant Name, Landlord Name, Landlord PAN (optional if rent < ₹1,00,000/year), Monthly Rent, Rental Period (e.g., April 2025 to March 2026), and Property Address.
    - Live PDF preview.
    - 1-Click "Download 12 Monthly Receipts (PDF)" generated client-side using `jspdf` and `jspdf-autotable`.
    - Revenue/Conversion Hook: Bottom banner: *"Looking for a better rental home in Rajkot with zero brokerage? Explore RentNest listings"*.
* **SEO Structure**:
  - URL: `/tools/free-hra-rent-receipt-generator`
  - Target Keywords: *"HRA rent receipt generator online"*, *"Rent receipt format for income tax"*, *"Generate rent receipt free PDF"*.

---

### Feature 15: Gujarat Standard 11-Month Bilingual Rental Agreement
* **Objective**: Generate standard, legally compliant 11-month rental agreement drafts in English & Gujarati.
* **Frontend & Backend Implementation**:
  - `src/pages/AgreementGeneratorPage.jsx`: Form auto-populating tenant, landlord, and property specs directly from an active listing or manual input.
  - Clause customization: Lock-in period (e.g. 6 months), Notice period (30 days), Annual rent increment (typically 5% or 10%).
  - Backend `POST /api/v1/agreements/generate-pdf` utilizes `pdfkit` to compile a clean 3-page agreement formatted for direct printing on standard Gujarat Stamp Paper (₹300 stamp paper header margin).

---

### Feature 16: Admin Operations Dashboard & Analytics
* **Objective**: Central operational command center for KYC approval, scam moderation, and rental market intelligence.
* **Frontend Modules (`src/pages/admin/`)**:
  - `AdminKycQueue.jsx`: Document review viewer with 1-click Approve / Reject actions.
  - `AdminModeration.jsx`: Review flagged scam listings and ban offending phone numbers/IPs.
  - `AdminAnalytics.jsx`: Locality rental trends (e.g., Average 2 BHK rent in Kalawad Road vs Nana Mava vs University Road), total active inventory, and conversion rates.
* **Backend Protection**: Strictly guarded with `protect` and `authorize('admin')` middlewares.

---

### Feature 17: SEO, WhatsApp OpenGraph Rich Cards & PWA Layer
* **Objective**: Maximum organic traffic and rich social link previews on WhatsApp/Instagram.
* **Implementation Details**:
  - Dynamic Meta Tags via `react-helmet-async`:
    - `og:title`: `₹14,000 | 2 BHK Flat for Rent on Kalawad Road, Rajkot`
    - `og:description`: `Direct Owner (Zero Brokerage). 24/7 Water, Pure Veg, Covered Car Parking. View inside photos & contact owner.`
    - `og:image`: High-res cover photo URL hosted on Cloudinary CDN.
  - **PWA Service Worker (`vite-plugin-pwa`)**:
    - `manifest.json`: App name, theme color (`#0F172A`), rental icons (`192x192`, `512x512`).
    - Cache-first strategy for static assets, network-first for API listings.
    - Triggers native "Install App" banner on Android Chrome.

---

## 8. Production Folder & Codebase Structure

```
RentalHome/
├── client/                               # React 18 (Vite) Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── manifest.json                 # PWA Manifest
│   │   └── icons/                        # PWA App Icons (192x192, 512x512)
│   ├── src/
│   │   ├── assets/                       # Static logos, placeholder graphics
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── common/                   # Navbar, Footer, Modal, Loader, Button
│   │   │   ├── auth/                     # AuthModal, OtpInput, RolePicker
│   │   │   ├── property/                 # PropertyCard, PriceBadge, LivingCostTable
│   │   │   ├── search/                   # SearchBar, FilterDrawer, LocalitySelector
│   │   │   ├── map/                      # LeafletMap, CustomMarker, MapPopup
│   │   │   ├── chat/                     # ChatWindow, MessageBubble, QuickReplies
│   │   │   └── compare/                  # CompareDrawer, ComparisonTable
│   │   ├── context/                      # SocketContext, ThemeContext
│   │   ├── hooks/                        # useAuth, useProperties, useDebounce
│   │   ├── pages/                        # View Pages
│   │   │   ├── HomePage.jsx              # Hero, quick search, featured localities
│   │   │   ├── SearchPage.jsx            # Split-screen map + property cards
│   │   │   ├── PropertyDetailPage.jsx    # Transparency hub, photos, cost breakdown
│   │   │   ├── PostPropertyPage.jsx      # 7-step wizard for owners/brokers
│   │   │   ├── RoommatesPage.jsx         # Flatmate finder section
│   │   │   ├── ComparePage.jsx           # Side-by-side 3-property comparison
│   │   │   ├── ChatPage.jsx              # In-app real-time messaging
│   │   │   ├── VisitsPage.jsx            # Digital visit passes & scheduling
│   │   │   ├── HraReceiptGeneratorPage.jsx # Free HRA tool (SEO driver)
│   │   │   ├── AgreementGeneratorPage.jsx # Rental agreement generator
│   │   │   ├── MoveInChecklistPage.jsx   # Deposit dispute protection
│   │   │   └── admin/                    # Admin dashboard views
│   │   │       ├── AdminKycQueue.jsx
│   │   │       ├── AdminModeration.jsx
│   │   │       └── AdminAnalytics.jsx
│   │   ├── services/                     # Axios API client functions
│   │   │   ├── api.js                    # Base Axios instance with JWT interceptor
│   │   │   ├── authService.js
│   │   │   ├── propertyService.js
│   │   │   ├── visitService.js
│   │   │   └── chatService.js
│   │   ├── store/                        # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── filterStore.js
│   │   │   └── compareStore.js
│   │   ├── utils/                        # Currency formatters, date helpers, PDF export
│   │   ├── App.jsx                       # Routes declaration
│   │   ├── main.jsx                      # Entrypoint
│   │   └── index.css                     # Tailwind CSS directives & global themes
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                               # Node.js + Express + MongoDB Backend
│   ├── config/
│   │   ├── db.js                         # Mongoose connection logic
│   │   └── cloudinary.js                 # Cloudinary SDK configuration
│   ├── controllers/                      # Business logic controllers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── visitController.js
│   │   ├── chatController.js
│   │   ├── checklistController.js
│   │   ├── agreementController.js
│   │   └── adminController.js
│   ├── middleware/                       # Express middlewares
│   │   ├── authMiddleware.js             # JWT verification & RBAC
│   │   ├── uploadMiddleware.js           # Multer + Cloudinary storage
│   │   ├── rateLimiter.js                # express-rate-limit instances
│   │   └── errorMiddleware.js            # Global centralized error handler
│   ├── models/                           # Mongoose data models
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── VisitRequest.js
│   │   ├── Chat.js
│   │   ├── SavedSearch.js
│   │   ├── MoveInChecklist.js
│   │   └── Report.js
│   ├── routes/                           # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── visitRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── toolRoutes.js                 # HRA and Agreement generators
│   │   └── adminRoutes.js
│   ├── services/                         # Notification & Cron services
│   │   ├── twilioService.js              # SMS & WhatsApp dispatch
│   │   ├── emailService.js               # Nodemailer / Resend templates
│   │   └── freshnessCron.js              # 21-day auto-check cron job
│   ├── sockets/                          # Real-time WebSocket handlers
│   │   └── chatSocket.js
│   ├── utils/                            # Helper functions & seeds
│   │   ├── seedLocalities.js             # Rajkot locality seed data
│   │   └── generatePdf.js
│   ├── .env.example
│   ├── server.js                         # HTTP server & Socket.io initialization
│   └── package.json
│
├── PROJECT_REQUIREMENTS.md               # Master product specification
├── ADDITIONAL_FEATURES_AND_IDEAS.md      # Strategic PropTech insights
└── PLAN.md                               # This master implementation plan
```

---

## 9. Development Roadmap & Phased Execution Plan

```mermaid
gantt
    title RentNest MERN Web App Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: MVP Core
    Project Setup & Mongo/Express Architecture :p1_1, 2026-11-01, 5d
    Auth System (Phone OTP, JWT, RBAC)         :p1_2, after p1_1, 5d
    7-Step Property Listing Wizard + Cloudinary:p1_3, after p1_2, 7d
    Search & Filter Engine (Localities, Meter) :p1_4, after p1_3, 7d
    Split-Screen Map + Property Detail Page    :p1_5, after p1_4, 6d
    WhatsApp Connect & Compare Tool (3 flats)  :p1_6, after p1_5, 4d
    section Phase 2: Growth & Realtime
    In-App Chat Engine (Socket.io)             :p2_1, after p1_6, 6d
    Calendar Visit Scheduling & Visit Pass     :p2_2, after p2_1, 5d
    Saved Searches & Instant WhatsApp Alerts   :p2_3, after p2_2, 4d
    Printable TO LET Poster with QR Code       :p2_4, after p2_3, 3d
    Free HRA Rent Receipt Generator (SEO)      :p2_5, after p2_4, 4d
    Roommate & Flatmate Sharing Section        :p2_6, after p2_5, 4d
    section Phase 3: Trust & Operations
    Owner KYC Verification (Electricity Bills) :p3_1, after p2_6, 5d
    Anti-Broker Impersonation Guard & Reports  :p3_2, after p3_1, 4d
    Digital Move-In Photo Condition Checklist  :p3_3, after p3_2, 5d
    Gujarat 11-Month Rental Agreement Generator:p3_4, after p3_3, 4d
    Admin Operations Dashboard & Analytics     :p3_5, after p3_4, 5d
    PWA Offline Support & Final SEO Polish     :p3_6, after p3_5, 4d
```

### Milestone Deliverables

#### Milestone 1: Core Foundation & Discovery (Weeks 1–4)
* Working full-stack repository setup with ESLint and Prettier.
* User registration and login via Phone OTP and Email with JWT authentication.
* Owner Property Posting wizard with image upload to Cloudinary and auto-watermarking.
* Search engine with Rajkot localities, split-screen Leaflet map, and deep filters (Sub-meter, Water supply, Veg-only).
* Property detail page with living cost calculator and "Chat on WhatsApp" button.

#### Milestone 2: Engagement, Realtime Chat & Growth Tools (Weeks 5–8)
* WebSocket-powered in-app chat with typing indicators and fraud alerts.
* Visit scheduling calendar with digital visit pass generation.
* Free 1-click HRA rent receipt generator tool ranking for organic SEO keywords.
* Printable "TO LET" gate poster with dynamic QR code pointing to property URL.
* Roommate/Flatmate sharing section for students and singles.

#### Milestone 3: High-Trust Verification, Legal Engine & Launch (Weeks 9–12)
* Electricity bill upload and admin KYC verification queue for green "Verified Owner" badges.
* Anti-broker detection engine (limits unverified owners to 2 distinct societies).
* Automated 21-day WhatsApp freshness bot for inventory accuracy.
* Digital move-in photo condition checklist to protect tenant security deposits.
* Gujarat 11-month bilingual rental agreement generator.
* PWA support ("Add to Home Screen" on mobile devices) and deployment to Vercel and Render.

---

## 10. Local Development, Deployment & CI/CD Guide

### 10.1 Running the Project Locally

#### 1. Clone & Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, and Cloudinary keys
npm run dev
# Server starts on http://localhost:5000
```

#### 2. Setup Frontend
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
# Vite client starts on http://localhost:5173
```

#### 3. Seed Rajkot Localities & Sample Properties
```bash
cd ../server
node utils/seedLocalities.js
```

### 10.2 Production Deployment Strategy
* **Frontend**: Deploy on **Vercel** (`client/` root directory). Set environment variables in Vercel project settings:
  - `VITE_API_BASE_URL=https://api.rentnest.in/api/v1`
  - `VITE_SOCKET_URL=https://api.rentnest.in`
* **Backend**: Deploy on **Render** or **Railway** (`server/` root directory).
  - Runtime: `Node 20`
  - Build Command: `npm install`
  - Start Command: `node server.js`
* **Database**: **MongoDB Atlas** M0 (Dev) or M10 (Production) with IP whitelist set to `0.0.0.0/0` (secured with strong password credentials).
* **Domain & SSL**: Setup custom domain (`rentnest.in` and `api.rentnest.in`) with automated free Cloudflare / Let's Encrypt SSL.

### 10.3 Complete Docker Containerization (Multi-Container Architecture)

The codebase includes an enterprise-grade multi-stage Docker architecture:

```
+-------------------------------------------------------------+
|                      docker-compose.yml                     |
|                                                             |
|  +-------------------+  +----------------+  +------------+  |
|  |   Client Service  |  | Server Service |  |  MongoDB   |  |
|  |   (Nginx Alpine)  |  | (Node 20 Alpine|  | (Mongo 7.0)|  |
|  |     Port 80       |  |   Port 5000    |  | Port 27017 |  |
|  +---------+---------+  +--------+-------+  +-----+------+  |
|            |                     |                |         |
|            +--------- network ---+----------------+         |
|                               |                             |
|                        volume: mongodb_data                 |
+-------------------------------------------------------------+
```

#### Docker Files Overview:
1. **`server/Dockerfile`**: Lightweight Node 20 Alpine container running production dependencies with security optimization.
2. **`client/Dockerfile`**: Multi-stage build (Stage 1: Node 20 Vite builder; Stage 2: Nginx Alpine web server with gzip compression and SPA routing fallback).
3. **`client/nginx.conf`**: Configures Nginx for React Router client-side routing and reverse-proxies `/api/` and WebSockets `/socket.io/`.
4. **`docker-compose.yml`**: Full-stack production compose file with healthcheck on MongoDB and automatic service dependency order.
5. **`docker-compose.dev.yml`**: Development compose file with live-reloading bind mounts (`./server:/app`, `./client:/app`).

#### Common Docker Commands:
```bash
# Start production containers in detached mode
docker compose up --build -d

# Seed database inside Docker
docker compose exec server npm run seed

# View real-time aggregated logs
docker compose logs -f

# Run with live development hot-reloading
docker compose -f docker-compose.dev.yml up --build

# Tear down containers and clean up networks
docker compose down
```

---

## 11. Required Subscriptions, API Keys & Environment Secrets Checklist

To transition from the local development prototype into full production with automated live services (image uploads, SMS/WhatsApp delivery, and email confirmations), you will need credentials for the following platforms.

> **💡 Note for Local Prototype Testing**:  
> The prototype code has been built with **intelligent fallbacks**:
> * Phone OTP defaults to `123456` in development mode (`USE_DEV_OTP=true`).
> * Cloudinary falls back to curated CDN property images if credentials are omitted.
> * Leaflet uses free OpenStreetMap tile layers with zero API keys required.
> * Database runs locally on MongoDB or connects to MongoDB Atlas free tier.

Below is the definitive checklist of every subscription, API key, and environment variable needed:

---

### 11.1 Cloud Database: MongoDB Atlas (`MONGO_URI`)

* **What it does**: Stores all users, property listings, scheduled visits, chat logs, and move-in checklists in the cloud.
* **Cost**: **$0 / month** (M0 Free Tier - 512 MB storage, shared RAM, free forever).
* **Credit Card Required**: ❌ No credit card needed.

#### 📝 Click-by-Click Steps to Get Your Connection String:
1. **Create Account**: Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and click **"Try Free"** or **"Sign In with Google"**.
2. **Create New Cluster**:
   * On the dashboard, click **"Create"** or **"Build a Database"**.
   * Under cluster types, select the **M0 Free** (Shared) option.
   * Provider & Region: Select **AWS** and choose **Mumbai (`ap-south-1`)** for lowest latency in Gujarat/India.
   * Cluster Name: Leave default `Cluster0` or name it `rentnest-cluster`.
   * Click **"Create Deployment"**.
3. **Create Database User Credentials**:
   * A "Security Quickstart" modal will appear.
   * Choose **"Username and Password"** authentication.
   * Username: enter `rentnest_admin`.
   * Password: click **"Autogenerate Secure Password"** or type a secure password (e.g. `RentNest2026SecurePass!`).
   * ⚠️ **IMPORTANT**: Copy and save this password immediately in your notes.
   * Click **"Create Database User"**.
4. **Configure Network Access (IP Whitelist)**:
   * In the same setup screen under **"Where would you like to connect from?"**, choose **"My Local Environment"**.
   * Under **IP Address**, click **"Add Entry"** and enter `0.0.0.0/0` (Description: `Allow access from anywhere`).
   * Click **"Add Entry"** or **"Finish and Close"**.
5. **Copy the Connection String**:
   * In the Clusters overview, click the blue **"Connect"** button next to your cluster.
   * Select **"Drivers"** (Node.js).
   * Ensure Driver is set to `Node.js` and Version is `5.5 or later`.
   * Look for the connection string format:
     ```text
     mongodb+srv://rentnest_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   * Replace `<password>` with the password you created in Step 3.
   * Add the database name `/rentnest` right before the `?` query parameters:
     ```text
     mongodb+srv://rentnest_admin:YourRealPasswordHere@cluster0.xxxxx.mongodb.net/rentnest?retryWrites=true&w=majority
     ```
6. **Paste into Environment File**:
   * Open `server/.env` and update:
     ```bash
     MONGO_URI=mongodb+srv://rentnest_admin:YourRealPasswordHere@cluster0.xxxxx.mongodb.net/rentnest?retryWrites=true&w=majority
     ```
7. **Verify**: Run `cd server && npm run dev`. The console will display: `✅ MongoDB Connected: cluster0-shard...`.

---

### 11.2 Authentication & Security Secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)

* **What it does**: Digitally signs authentication tokens so users and owners remain logged in securely.
* **Cost**: **$0 / month** (Generated locally using cryptographic random bytes).
* **Credit Card Required**: ❌ No.

#### 📝 Click-by-Click Steps to Generate Secrets:
1. Open PowerShell or Terminal in your project directory.
2. Run this command in your terminal to generate a secure random 256-bit string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Copy the output string (e.g. `8f4b1c93e4812a80d5071fbc65f6c...`).
4. Run the command a second time to get a distinct refresh secret.
5. Open `server/.env` and paste:
   ```bash
   JWT_SECRET=paste_first_generated_hex_string_here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=paste_second_generated_hex_string_here
   JWT_REFRESH_EXPIRES=30d
   ```

---

### 11.3 Cloud Image Storage & CDN: Cloudinary (`CLOUDINARY_*`)

* **What it does**: Hosts property photos uploaded by owners/brokers, auto-optimizes images for mobile speeds, and creates dynamic watermarks.
* **Cost**: **$0 / month** (Free Tier includes 25 Monthly Credits = ~25 GB storage and 25,000 monthly transformations).
* **Credit Card Required**: ❌ No credit card required.

#### 📝 Click-by-Click Steps to Obtain Keys:
1. **Sign Up**: Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free) and sign up with your email or Google account.
2. **Access Dashboard**:
   * Once logged in, you will land on the **Cloudinary Console (Programmable Media Dashboard)**.
3. **Locate Product Environment Credentials**:
   * Right on the dashboard home screen under **"Product Environment Credentials"**, you will see:
     * **Cloud Name**: (e.g. `djxy89abc`)
     * **API Key**: (e.g. `784931298471923`)
     * **API Secret**: Click the eye icon / **"Copy API Secret"** to reveal it.
4. **Paste into Environment File**:
   * Open `server/.env` and add:
     ```bash
     CLOUDINARY_CLOUD_NAME=your_copied_cloud_name
     CLOUDINARY_API_KEY=your_copied_api_key
     CLOUDINARY_API_SECRET=your_copied_api_secret
     CLOUDINARY_FOLDER=rentnest_properties
     ```
5. *(Optional) If you ever forget where to find them*: Click **Settings (gear icon)** at bottom left -> **Access Keys** -> Copy credentials from there.

---

### 11.4 WhatsApp & SMS Notifications: Twilio (`TWILIO_*`)

* **What it does**: Delivers 6-digit phone OTPs to users, sends instant WhatsApp visit booking alerts, and automates 21-day freshness check-ins to landlords.
* **Cost**: Free trial with **$15.50 free trial credits** (sufficient for testing hundreds of SMS and WhatsApp messages).
* **Credit Card Required**: ❌ Optional for trial sandbox.

#### 📝 Click-by-Click Steps to Obtain Keys:
1. **Sign Up**: Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio) and register.
2. **Verify Personal Phone**: Twilio will prompt you to enter your personal mobile number and verify it via SMS code.
3. **Access Twilio Console**:
   * On the **Twilio Console Dashboard** ([https://console.twilio.com](https://console.twilio.com)), scroll down to **"Account Info"**.
   * Copy the **Account SID** (starts with `AC...`).
   * Copy the **Auth Token** (click "Show" to reveal).
4. **Get a Twilio Phone Number**:
   * Click the blue button **"Get a trial phone number"**.
   * Twilio will assign you a phone number (e.g. `+14155238886`).
5. **Activate the WhatsApp Sandbox (For WhatsApp Alerts)**:
   * In the left sidebar, navigate to: **Messaging** -> **Try it out** -> **Send a WhatsApp message**.
   * Twilio will show a QR code and instructions (e.g., *Send WhatsApp message `join <your-sandbox-word>` to `+1 415 523 8886`*).
   * Open WhatsApp on your phone and send that exact message to the number.
   * You will receive an instant reply: *"You are all set! Sandbox joined successfully"*.
6. **Paste into Environment File**:
   * Open `server/.env` and update:
     ```bash
     TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
     TWILIO_PHONE_NUMBER=+14155238886
     TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
     USE_DEV_OTP=false        # Set to false to send real SMS; keep true for dev mode
     DEV_OTP_CODE=123456
     ```

---

### 11.5 Transactional Email: Resend or Gmail SMTP (`SMTP_*`)

* **What it does**: Sends HRA rent receipt PDFs, visit pass confirmations, and verification status emails.

#### Option A: Resend (Recommended Modern Email API)
* **Website**: [https://resend.com](https://resend.com)
* **Cost**: **$0 / month** (Free tier allows 3,000 emails/month, 100 emails/day).
* **Credit Card Required**: ❌ No.
* **Steps**:
  1. Sign up at [https://resend.com/signup](https://resend.com/signup).
  2. In the dashboard left sidebar, click **"API Keys"**.
  3. Click **"Create API Key"** -> Name it `RentNest Production` -> Permission: `Full Access` -> Click **Add**.
  4. Copy the generated key (starts with `re_...`).
  5. Add to `server/.env`:
     ```bash
     RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
     EMAIL_FROM="RentNest <onboarding@resend.dev>"
     ```

#### Option B: Free Gmail App Password (Zero Third-Party Accounts)
* **Cost**: **$0 / month** (Sends up to 500 emails/day directly through your existing Gmail).
* **Steps**:
  1. Open your browser and go to [https://myaccount.google.com/security](https://myaccount.google.com/security).
  2. Under **"How you sign in to Google"**, ensure **"2-Step Verification"** is turned **ON**.
  3. In the top search bar of Google Account, search for **"App passwords"** and click on it.
  4. In the "App name" field, type `RentNest Server` and click **"Create"**.
  5. Google will display a **16-character yellow password** (e.g. `abcd efgh ijkl mnop`).
  6. Copy this 16-character code (without spaces).
  7. Add to `server/.env`:
     ```bash
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your_email@gmail.com
     SMTP_PASS=abcdefghijklmnop
     EMAIL_FROM="RentNest Team <your_email@gmail.com>"
     ```

---

### 11.6 Interactive Maps: OpenStreetMap vs Google Maps

#### Default: OpenStreetMap & Leaflet (Active in Prototype)
* **Cost**: **$0 / month (100% Free forever)**.
* **API Key Needed**: ❌ **NONE**.
* Leaflet map rendering is already fully implemented in [`SplitMap.jsx`](client/src/components/SplitMap.jsx) and works immediately with zero registration or rate-limiting.

#### Optional: Google Maps Platform (If adding Google Autocomplete / Street View)
* **Cost**: $200 free monthly credit (~28,000 free map loads every month).
* **Credit Card Required**: ✅ Yes (for Google Cloud identity verification).
* **Steps**:
  1. Go to [https://console.cloud.google.com](https://console.cloud.google.com) and sign in.
  2. Click **"Select a project"** -> **"New Project"** -> Name it `RentNest-Maps` -> Click **Create**.
  3. In the top search bar, search for **"Maps JavaScript API"** and click **"Enable"**.
  4. Search for **"Places API"** and click **"Enable"**.
  5. Go to **APIs & Services** -> **Credentials** -> Click **"+ CREATE CREDENTIALS"** -> Select **"API key"**.
  6. Copy the generated key (starts with `AIzaSy...`).
  7. *(Recommended Security)*: Click **"Edit API key"** -> Under "Application restrictions", choose **"Websites"** -> Add `http://localhost:5173/*` and your production domain.
  8. Paste into `client/.env`:
     ```bash
     VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-YourCopiedGoogleMapsKey
     ```

---

### 11.7 Production Hosting Services: Vercel & Render

#### Frontend Deployment: Vercel
1. Go to [https://vercel.com/signup](https://vercel.com/signup) and log in with your GitHub account.
2. Push your RentNest project to a GitHub repository (`git push origin main`).
3. On Vercel dashboard, click **"Add New..."** -> **"Project"** -> Select your `RentalHome` repository.
4. Set **Root Directory** to `client`.
5. Under **Environment Variables**, add:
   * `VITE_API_BASE_URL` = `https://your-backend-service.onrender.com/api/v1`
   * `VITE_SOCKET_URL` = `https://your-backend-service.onrender.com`
6. Click **"Deploy"**. Vercel will build and assign an SSL URL (e.g. `https://rentnest.vercel.app`).

#### Backend & WebSockets Deployment: Render
1. Go to [https://render.com](https://render.com) and sign up with GitHub.
2. Click **"New +"** -> **"Web Service"** -> Connect your GitHub repository.
3. Configure settings:
   * **Root Directory**: `server`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Instance Type**: **Free** ($0/month) or **Starter** ($7/month for non-sleeping WebSockets).
4. Under **Environment Variables**, click **"Add Environment Variable"** and paste all values from your `server/.env` (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, etc.).
5. Click **"Deploy Web Service"**.

---

### 11.8 Production vs. Development Configuration Matrix

| Variable Name | Environment File | Development Prototype Value | Production Value Source |
| :--- | :--- | :--- | :--- |
| `MONGO_URI` | `server/.env` | `mongodb://127.0.0.1:27017/rentnest` | MongoDB Atlas (Section 11.1) |
| `JWT_SECRET` | `server/.env` | `rentnest_production_grade_secret...` | Generated 256-bit crypto hex (Section 11.2) |
| `JWT_REFRESH_SECRET` | `server/.env` | `rentnest_refresh_secret...` | Generated 256-bit crypto hex (Section 11.2) |
| `CLOUDINARY_CLOUD_NAME` | `server/.env` | *(Falls back to high-res CDN photos)* | Cloudinary Console Dashboard (Section 11.3) |
| `CLOUDINARY_API_KEY` | `server/.env` | *(Optional in local mode)* | Cloudinary Console Dashboard (Section 11.3) |
| `CLOUDINARY_API_SECRET` | `server/.env` | *(Optional in local mode)* | Cloudinary Console Dashboard (Section 11.3) |
| `TWILIO_ACCOUNT_SID` | `server/.env` | *(Optional in local mode)* | Twilio Console Account Info (Section 11.4) |
| `TWILIO_AUTH_TOKEN` | `server/.env` | *(Optional in local mode)* | Twilio Console Account Info (Section 11.4) |
| `USE_DEV_OTP` | `server/.env` | `true` (Uses instant OTP: `123456`) | Set to `false` when using live Twilio SMS |
| `DEV_OTP_CODE` | `server/.env` | `123456` | Set to empty or omitted in production |
| `SMTP_USER` & `SMTP_PASS` | `server/.env` | *(Email logs simulated in console)* | Resend API key or Gmail App Password (Section 11.5) |
| `VITE_API_BASE_URL` | `client/.env` | `http://localhost:5000/api/v1` | Render / Railway backend URL (Section 11.7) |
| `VITE_SOCKET_URL` | `client/.env` | `http://localhost:5000` | Render / Railway backend URL (Section 11.7) |

---

## 12. Master Technical Architecture for All Strategic Suggestions

This section details the end-to-end technical specifications, database schemas, REST endpoints, and UI architectures for all strategic enhancements approved for RentNest.

---

### 12.1 Side-by-Side Property Comparison & AI Best-Fit Recommendation Engine

* **Objective**: Automate decision-making for renters evaluating 2–3 properties by scoring true living costs (PGVCL direct meter vs sub-meter markups, water stability, brokerage savings, and space efficiency) through an intelligent AI engine.
* **Algorithm & Weighting Matrix**:
  ```
  Total AI Score (Max 100) =
      + Direct PGVCL Govt Meter:       30 pts (eliminates ₹10-₹12/unit markups; saves ~₹1,500/mo)
      + 24/7 Continuous Narmada Water: 25 pts (zero tanker dependency)
      + Zero Brokerage (Direct Owner): 20 pts (saves up to 1 month rent)
      + Low Security Deposit (<= 2mo): 10 pts (standard Rajkot liquidity protection)
      + Space Efficiency (sqft/₹):     15 pts (carpet area per ₹1,000 monthly rent)
  ```
* **Dynamic Preset Lenses**:
  - `Best Overall Value`: Balanced weighting across utility savings and total monthly outflow.
  - `Lowest Monthly Outflow`: Prioritizes raw rent + maintenance totals.
  - `Maximum Space / Luxury`: Heavily weights carpet area and furnishing status.
* **Component Architecture**:
  - [`client/src/components/CompareModal.jsx`](file:///C:/Users/Radhika/OneDrive/Desktop/Mern/RentalHome/RentalHome/client/src/components/CompareModal.jsx): Mobile-responsive (`max-h-[92vh] overflow-y-auto`) modal with sticky header, horizontal swipe hints, AI verdict card, and direct WhatsApp CTA.
  - [`client/src/context/CompareContext.jsx`](file:///C:/Users/Radhika/OneDrive/Desktop/Mern/RentalHome/RentalHome/client/src/context/CompareContext.jsx): Shortlist management synchronized with `localStorage` and optional MongoDB sync.

---

### 12.2 Persistent Cloud Wishlist & Saved Properties Architecture

* **Objective**: Enable cross-device property saving for tenants who search over multiple days, with automated alerts on price drops or availability confirmations.
* **Database Schema Extension (`server/models/User.js`)**:
  ```javascript
  userSchema.add({
    savedProperties: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Property',
      index: true 
    }],
    activeComparisonList: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Property' 
    }]
  });
  ```
* **REST API Specifications**:
  - `POST /api/v1/properties/:id/save`: Authenticated toggle endpoint that pushes or pulls the property ID from `user.savedProperties` and returns the updated status.
  - `GET /api/v1/properties/my/saved`: Returns all populated properties bookmarked by the user, sorted by bookmark date.
  - `PUT /api/v1/properties/my/comparison`: Cloud-syncs the active 3-property comparison array to user account.
* **UI Implementation**:
  - 1-Click interactive Heart icon on [`PropertyCard.jsx`](file:///C:/Users/Radhika/OneDrive/Desktop/Mern/RentalHome/RentalHome/client/src/components/PropertyCard.jsx) with optimistic UI updates.
  - Dedicated **"Saved Homes"** tab on the user's Dashboard ([`DashboardPage.jsx`](file:///C:/Users/Radhika/OneDrive/Desktop/Mern/RentalHome/RentalHome/client/src/pages/DashboardPage.jsx)).

---

### 12.3 AI-Powered Electricity Bill & Address Verification Pipeline

* **Objective**: Eradicate ghost and fake listings by requiring landlords to upload an official utility bill (e.g., PGVCL in Saurashtra) and verifying genuine ownership via AI Vision OCR.
* **Data Flow Architecture**:
  1. **Upload**: Landlord uploads bill photo/PDF in Step 5 of Post Property.
  2. **Extraction Engine**: Server forwards file buffer to Google Gemini 1.5 Flash Vision / Document AI with structured JSON prompt:
     ```json
     {
       "consumerNumber": "11-digit PGVCL consumer code",
       "consumerName": "Full name printed on bill",
       "serviceAddress": "Physical installation address",
       "tariffType": "R-LT (Residential) or C-LT (Commercial)"
     }
     ```
  3. **Verification Matcher**:
     - Compares `consumerName` with `User.name` using Levenshtein distance string matching (>80% threshold).
     - Validates that `tariffType` is `R-LT` (prevents commercial units masquerading as residential).
     - Confirms locality matches property `fullAddress`.
  4. **Status Assignment**: Automatically tags property with `isVerifiedOwner = true` and `isAiVerified = true`, displaying the green badge on cards and detail pages.

---

### 12.4 Owner & Broker Multi-Property Portfolio Management

* **Objective**: Enable landlords (who typically own 2–5 units) and commercial brokers (managing 15–50 listings) to manage their entire inventory from a single unified dashboard.
* **Portfolio Capabilities**:
  - **Quick Status Toggle**: 1-click toggle between `"Available"` and `"Rented Out"` to prevent phone calls once a tenant signs the agreement.
  - **Inquiry & Lead Analytics**: Real-time counter of total page views, shortlist counts, and physical visit requests received per property.
  - **Single-Click Duplicate**: Allows brokers to clone a listing (e.g. identical 2 BHK in the same apartment tower) with different floor numbers.
* **REST Endpoints**:
  - `GET /api/v1/properties/my/listings`: Returns all listings owned by `req.user._id` with status filters (`active`, `rented`, `unlisted`).
  - `PATCH /api/v1/properties/:id/toggle-status`: Instantly toggles between `active` and `rented`.

---

### 12.5 Dynamic Multi-City Scaling Engine

* **Objective**: Architecture that dynamically serves multiple Tier-1 and Tier-2 cities in Gujarat (Rajkot, Ahmedabad, Surat, Vadodara, Gandhinagar) without hardcoded queries or schema changes.
* **City Registry Architecture**:
  ```javascript
  const CITY_REGISTRY = {
    Rajkot: {
      center: [22.3039, 70.8022],
      defaultZoom: 13,
      discom: 'PGVCL',
      localities: ['Kalawad Road', 'University Road', '150 Ft Ring Road', 'Nana Mava', 'Raiya Road', 'Sadhu Vaswani Road']
    },
    Ahmedabad: {
      center: [23.0225, 72.5714],
      defaultZoom: 13,
      discom: 'Torrent Power / UGVCL',
      localities: ['SG Highway', 'Prahlad Nagar', 'Bodakdev', 'Satellite', 'Bopal', 'Vastrapur']
    },
    Surat: {
      center: [21.1702, 72.8311],
      defaultZoom: 13,
      discom: 'DGVCL / Torrent Power',
      localities: ['Vesu', 'Adajan', 'Pal', 'Piplod', 'Ghod Dod Road', 'Varachha']
    },
    Vadodara: {
      center: [22.3072, 73.1812],
      defaultZoom: 13,
      discom: 'MGVCL',
      localities: ['Alkapuri', 'Vasna Road', 'Gotri', 'OP Road', 'Manjalpur', 'Sayajigunj']
    }
  };
  ```
* **Dynamic Client Updates**:
  - Navbar contains global city dropdown selector stored in `localStorage` and URL parameter (`?city=Ahmedabad`).
  - Leaflet map re-centers dynamically to `CITY_REGISTRY[selectedCity].center`.
  - Utility labels and filter options adapt to local DISCOM rules automatically.

---

### 12.6 Direct UPI Rent QR Code Generation on Rental Agreements

* **Objective**: Automate rent payment collection by embedding a standardized NPCI-compliant UPI QR code into digital rental agreements and invoices.
* **Payload Format**:
  `upi://pay?pa={landlordVpa}&pn={landlordName}&am={rentAmount}&cu=INR&tn=RentNest_Rent_{monthYear}`
* **Generation Engine**:
  - Backend utilizes `qrcode.toDataURL()` in `server/controllers/toolsController.js` during agreement compilation.
  - Injected directly into printable HTML and PDF agreement outputs.
  - Tenants scan using any Indian payment app (Google Pay, PhonePe, Paytm, BHIM) to settle monthly rent.

---

### 12.7 Automated 21-Day WhatsApp Listing Freshness Bot

* **Objective**: Ensure 100% active inventory by automatically checking listing status with landlords every 21 days via WhatsApp conversational webhooks.
* **Workflow**:
  - Daily cron job at `0 10 * * *` queries listings where `lastFreshnessConfirmedAt < Date.now() - 21 days`.
  - Twilio/Gupshup API sends 2-way WhatsApp prompt.
  - Webhook parser handles incoming answers:
    - `"1"`: Resets freshness counter.
    - `"2"`: Flips status to `'rented'` and notifies any tenants who had saved the listing.

---

### 12.8 Progressive Web App (PWA) Mobile Install Experience

* **Objective**: Provide a native-like mobile app experience with zero App Store friction or fee overhead.
* **Components**:
  - Manifest: [`client/public/manifest.json`](file:///C:/Users/Radhika/OneDrive/Desktop/Mern/RentalHome/RentalHome/client/public/manifest.json) configured with standalone display, orientation lock, and brand icons.
  - Custom In-App Install Banner: Listens to the `beforeinstallprompt` event and prompts mobile users to "Add RentNest to Home Screen" with 1 click.
  - Service Worker: Caches static CSS, JS chunks, and Leaflet map tiles for offline resilience.

---

*This document is the authoritative engineering blueprint for RentNest. All teams, subagents, and developers must follow these schema definitions, API endpoints, and component hierarchies during implementation.*
