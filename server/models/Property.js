const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  listingNumber: { type: String, unique: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  // Categorization
  category: {
    type: String,
    enum: ['residential', 'commercial'],
    default: 'residential',
    index: true
  },
  propertyType: { 
    type: String, 
    enum: [
      'flat', 'independent_house', 'row_house', 'penthouse', 'pg_coliving', 'shared_room',
      'retail_shop', 'corporate_office', 'showroom', 'warehouse_godown', 'industrial_shed', 'co_working'
    ],
    default: 'flat',
    required: true 
  },
  bhk: { 
    type: String, 
    enum: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'N/A'], 
    default: 'N/A' 
  },
  carpetAreaSqFt: { type: Number, required: true },
  floorNumber: { type: Number, default: 0 },
  totalFloors: { type: Number, default: 1 },
  facing: { type: String, enum: ['East', 'North-East', 'North', 'West', 'South', 'Other'], default: 'East' },

  // Commercial Specific Specifications (Active when category === 'commercial')
  commercialDetails: {
    commercialType: {
      type: String,
      enum: ['retail_shop', 'corporate_office', 'showroom', 'warehouse_godown', 'industrial_shed', 'co_working'],
      default: 'retail_shop'
    },
    connectedPowerLoadHp: { type: Number, default: 5 }, // HP (Horsepower)
    electricPhaseType: { type: String, enum: ['single_phase', 'three_phase'], default: 'three_phase' },
    frontageRoadWidthFt: { type: Number, default: 40 }, // Road width in ft
    ceilingHeightClearFt: { type: Number, default: 12 }, // Clear height in ft
    floorLoadingCapacityTonPerSqM: { type: Number, default: 1 },
    escalationPercentage: { type: Number, default: 5 }, // % yearly escalation
    lockInPeriodMonths: { type: Number, default: 12 },
    camChargesPerSqFtMonthly: { type: Number, default: 0 },
    gstin: { type: String, default: '' },
    isGstApplicable: { type: Boolean, default: false },
    fireNocStatus: { type: Boolean, default: false },
    buPermissionCertified: { type: Boolean, default: true },
    loadingUnloadingDock: { type: Boolean, default: false },
    goodsElevatorAvailable: { type: Boolean, default: false },
    shutterWidthFt: { type: Number, default: 12 }
  },

  // Location Details
  city: { type: String, default: 'Rajkot', index: true },
  locality: { type: String, required: true, index: true },
  societyName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  landmark: String,
  distanceToKeyLandmarks: [{
    name: String,
    distanceKm: Number
  }],
  coordinates: {
    lat: { type: Number, required: true, default: 22.3039 },
    lng: { type: Number, required: true, default: 70.8022 }
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
    subMeterUnitRate: { type: Number, default: 0 },
    waterSupplyType: { 
      type: String, 
      enum: ['24_7_continuous', 'scheduled_municipal', 'tanker_dependent'],
      default: '24_7_continuous'
    },
    waterScheduleHours: { type: String, default: '24 Hours Continuous' },
    waterSource: { 
      type: [String], 
      default: ['Municipal RMC/Narmada']
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
      enum: ['Pure Vegetarian Only', 'Vegetarian / Jain Preferred', 'Non-Veg Allowed', 'Any'], 
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
  furnishingItems: [String],
  amenities: [String],

  // Media
  photos: [{
    url: { type: String, required: true },
    publicId: String,
    roomTag: { 
      type: String, 
      default: 'Living Room'
    },
    isCoverPhoto: { type: Boolean, default: false }
  }],
  videoTourUrl: String,

  // Listing Status & Freshness
  status: { 
    type: String, 
    enum: ['active', 'rented', 'unlisted', 'quarantined'], 
    default: 'active',
    index: true
  },
  isVerifiedOwner: { type: Boolean, default: false },
  ownershipDocumentUrl: { type: String, default: '' },
  ownershipDocumentType: { 
    type: String, 
    enum: ['electricity_bill', 'property_tax_receipt', 'index_2_deed', 'society_maintenance_bill', 'none'],
    default: 'none'
  },
  ownershipDocumentVerified: { type: Boolean, default: false },
  verifiedDocumentDetails: {
    consumerName: String,
    consumerNumber: String,
    discomProvider: String,
    matchConfidence: Number,
    verifiedAt: Date,
    autoVerified: Boolean,
    verificationNote: String
  },
  viewCount: { type: Number, default: 0 },
  shortlistCount: { type: Number, default: 0 },
  lastFreshnessConfirmedAt: { type: Date, default: Date.now },
  freshnessReminderCount: { type: Number, default: 0 },

  // Anti-scam Moderation
  reportCount: { type: Number, default: 0 },
  isQuarantined: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-generate slug and listingNumber before validation
propertySchema.pre('validate', function(next) {
  if (!this.listingNumber) {
    this.listingNumber = 'RN-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (!this.slug) {
    const cleanTitle = (this.title || 'home')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    this.slug = `${cleanTitle}-${this.listingNumber.toLowerCase()}`;
  }
  next();
});

propertySchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);
