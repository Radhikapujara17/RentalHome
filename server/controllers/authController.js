const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rentnest_production_grade_secret_key_2026_xyz', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register New User (Store data in MongoDB)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role = 'tenant', city = 'Rajkot', agencyName } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide your full name, phone number, and password' });
    }

    // Check if user already exists with this phone
    let existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists. Please log in.' });
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }
    }

    // Prepare user object
    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      password,
      role: ['tenant', 'owner', 'broker'].includes(role) ? role : 'tenant',
      city: city || 'Rajkot',
      isPhoneVerified: true
    };

    if (role === 'broker' && agencyName) {
      userData.brokerDetails = {
        agencyName: agencyName.trim(),
        brokerageTerms: '15 Days Rent',
        experienceYears: 1
      };
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        city: user.city || city,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Standard Login with Phone/Email & Password
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your phone/email and password' });
    }

    // Search by phone or email
    const user = await User.findOne({
      $or: [
        { phone: identifier.trim() }, 
        { email: identifier.trim().toLowerCase() }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Account not found.' });
    }

    if (user.password) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
      }
    } else {
      user.password = password;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        city: user.city || 'Rajkot',
        avatar: user.avatar,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Phone OTP
// @route   POST /api/v1/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
    }

    const otp = process.env.USE_DEV_OTP === 'true' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ phone });
    if (!user) {
      // Create user placeholder
      user = new User({
        name: `User ${phone.slice(-4)}`,
        phone,
        otpCode: otp,
        otpExpiresAt: otpExpires
      });
    } else {
      user.otpCode = otp;
      user.otpExpiresAt = otpExpires;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${phone}`,
      devOtp: process.env.USE_DEV_OTP === 'true' ? otp : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Phone OTP & Login/Register
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, role, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found. Request an OTP first.' });
    }

    // Verify OTP (allow 123456 in dev mode)
    const isDevMatch = process.env.USE_DEV_OTP === 'true' && otp === '123456';
    const isOtpValid = (user.otpCode === otp && user.otpExpiresAt > Date.now()) || isDevMatch;

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    // Update details
    user.isPhoneVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    if (role && ['tenant', 'owner', 'broker'].includes(role)) {
      user.role = role;
    }
    if (name) {
      user.name = name;
    }
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Demo Quick Login (Tenant / Owner / Broker / Admin)
// @route   POST /api/v1/auth/demo-login
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const { role = 'tenant' } = req.body;

    // Find first user with that role or create on-the-fly demo user
    let user = await User.findOne({ role });

    if (!user) {
      const demoPhones = {
        tenant: '+919876543201',
        owner: '+919876543202',
        broker: '+919876543203',
        admin: '+919876543204'
      };
      const demoNames = {
        tenant: 'Priya Mehta (Tenant)',
        owner: 'Jayesh Patel (Direct Owner)',
        broker: 'Rajkot Prime Properties (Broker)',
        admin: 'Admin Operations'
      };

      user = await User.create({
        name: demoNames[role] || 'Demo User',
        phone: demoPhones[role] || `+91987650000${Math.floor(Math.random() * 9)}`,
        email: `${role}@rentnest.in`,
        role,
        isPhoneVerified: true,
        verificationStatus: role === 'owner' ? 'verified' : 'unverified',
        brokerDetails: role === 'broker' ? {
          agencyName: 'Rajkot Prime Realty',
          brokerageTerms: '15 Days Rent',
          experienceYears: 7
        } : undefined
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus,
        brokerDetails: user.brokerDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged In Profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile & Contact Preference
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, contactPreference, brokerDetails } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (contactPreference) user.contactPreference = contactPreference;
    if (brokerDetails && user.role === 'broker') {
      user.brokerDetails = { ...user.brokerDetails, ...brokerDetails };
    }

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Owner Electricity Bill / KYC Document
// @route   POST /api/v1/auth/kyc/submit
// @access  Private
exports.submitKyc = async (req, res, next) => {
  try {
    const { kycDocumentUrl, kycDocumentType = 'electricity_bill' } = req.body;
    if (!kycDocumentUrl) {
      return res.status(400).json({ success: false, message: 'Please provide document URL / photo' });
    }

    const user = await User.findById(req.user.id);
    user.kycDocumentUrl = kycDocumentUrl;
    user.kycDocumentType = kycDocumentType;
    user.verificationStatus = 'pending';
    user.kycSubmittedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC Document submitted for admin verification',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Pending KYC Requests (Admin)
// @route   GET /api/v1/auth/admin/kyc/pending
// @access  Private (Admin)
exports.getPendingKycList = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ verificationStatus: 'pending' }).sort({ kycSubmittedAt: -1 });
    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Owner KYC (Admin)
// @route   PUT /api/v1/auth/admin/kyc/:id/review
// @access  Private (Admin)
exports.reviewKyc = async (req, res, next) => {
  try {
    const { status } = req.body; // 'verified' | 'rejected'
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    targetUser.verificationStatus = status;
    if (status === 'verified') {
      targetUser.kycVerifiedAt = new Date();
      // Auto-tag all this owner's properties with the Verified Owner Badge!
      const Property = require('../models/Property');
      await Property.updateMany({ owner: targetUser._id }, { isVerifiedOwner: true });
    }
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User KYC ${status} successfully`,
      user: targetUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Platform Operations Metrics (Admin)
// @route   GET /api/v1/auth/admin/metrics
// @access  Private (Admin)
exports.getAdminMetrics = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const VisitRequest = require('../models/VisitRequest');

    const [totalUsers, totalProperties, pendingKyc, totalVisits] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      User.countDocuments({ verificationStatus: 'pending' }),
      VisitRequest.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalProperties,
        pendingKyc,
        totalVisits
      }
    });
  } catch (error) {
    next(error);
  }
};
