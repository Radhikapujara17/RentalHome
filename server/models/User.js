const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], 
    unique: true, 
    index: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return false;
        // Standardize clean format: +91XXXXXXXXXX or 10-digit mobile starting with 6-9
        const clean = v.replace(/[\s\-\(\)\.]/g, '');
        return /^(\+91)?[6-9]\d{9}$/.test(clean);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number.`
    }
  },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  password: { 
    type: String, 
    select: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // password is not strictly required if using OTP-only login
        // If already hashed with bcrypt, skip validation
        if (/^\$2[aby]\$\d+\$/.test(v)) return true;
        return v.length >= 6 && /[a-zA-Z]/.test(v) && /[0-9]/.test(v);
      },
      message: 'Password must be at least 6 characters long and contain both letters and numbers.'
    }
  },
  role: { 
    type: String, 
    enum: ['tenant', 'owner', 'broker', 'admin'], 
    default: 'tenant' 
  },
  avatar: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' 
  },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  
  // Saved / Wishlisted Properties (MongoDB relations)
  savedProperties: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }],
  city: { 
    type: String, 
    default: 'Rajkot' 
  },

  // Broker specific details
  brokerDetails: {
    agencyName: String,
    brokerageTerms: { type: String, default: '15 Days Rent' },
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

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
