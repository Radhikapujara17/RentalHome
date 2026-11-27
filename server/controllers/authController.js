const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { 
  verifyNameMatch, 
  normalizeAndValidatePhone, 
  validatePassword,
  getJwtSecret,
  sanitizeUser,
  escapeRegex
} = require('../utils/helpers');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const setAuthCookie = (res, token) => {
  res.cookie('rentnest_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const isDevOtpEnabled = () =>
  process.env.NODE_ENV !== 'production' && process.env.USE_DEV_OTP === 'true';

const isDemoLoginEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEMO_MODE === 'true';

// @desc    Register New User (Store data in MongoDB)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role = 'tenant', city = 'Rajkot', agencyName } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    // Phone validation
    const phoneCheck = normalizeAndValidatePhone(phone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({ success: false, message: phoneCheck.error });
    }

    // Password validation
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ success: false, message: passwordCheck.error });
    }

    // Check if user already exists with this phone (formatted or raw)
    let existingPhone = await User.findOne({ 
      phone: { $in: [phoneCheck.formattedPhone, phoneCheck.raw10, phone.trim()] } 
    });
    if (existingPhone && !existingPhone.isDeleted) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists. Please log in.' });
    }

    // Check if email already exists on another active user
    if (email) {
      const existingEmail = await User.findOne({
        email: email.trim().toLowerCase(),
        ...(existingPhone ? { _id: { $ne: existingPhone._id } } : {}),
        isDeleted: { $ne: true }
      });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }
    }

    const normalizedRole = ['tenant', 'owner', 'broker'].includes(role) ? role : 'tenant';
    let user;

    if (existingPhone && existingPhone.isDeleted) {
      // Reactivate previously soft-deleted account cleanly
      existingPhone.name = name.trim();
      existingPhone.phone = phoneCheck.formattedPhone;
      existingPhone.email = email ? email.trim().toLowerCase() : undefined;
      existingPhone.password = password;
      existingPhone.role = normalizedRole;
      existingPhone.city = city || 'Rajkot';
      existingPhone.isPhoneVerified = true;
      existingPhone.verificationStatus = 'unverified';
      existingPhone.isDeleted = false;
      existingPhone.deletedAt = undefined;
      if (normalizedRole === 'broker' && agencyName) {
        existingPhone.brokerDetails = {
          agencyName: agencyName.trim(),
          brokerageTerms: '15 Days Rent',
          experienceYears: 1
        };
      }
      user = await existingPhone.save();
    } else {
      // Prepare user object with normalized phone
      const userData = {
        name: name.trim(),
        phone: phoneCheck.formattedPhone,
        email: email ? email.trim().toLowerCase() : undefined,
        password,
        role: normalizedRole,
        city: city || 'Rajkot',
        isPhoneVerified: true
      };

      if (normalizedRole === 'broker' && agencyName) {
        userData.brokerDetails = {
          agencyName: agencyName.trim(),
          brokerageTerms: '15 Days Rent',
          experienceYears: 1
        };
      }

      user = await User.create(userData);
    }
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
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

    if (!identifier || !identifier.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your phone/email and password.' });
    }

    const cleanIdentifier = identifier.trim();

    // Check if password has minimum length
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Search conditions for identifier
    const phoneCheck = normalizeAndValidatePhone(cleanIdentifier);
    const orConditions = [
      { email: cleanIdentifier.toLowerCase() },
      { phone: cleanIdentifier }
    ];

    if (phoneCheck.isValid) {
      orConditions.push({ phone: phoneCheck.formattedPhone });
      orConditions.push({ phone: phoneCheck.raw10 });
    }

    const user = await User.findOne({ $or: orConditions }).select('+password');

    if (!user || user.isDeleted) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Account not found.' });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Phone OTP login. Please sign in with OTP or set a password from your profile.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
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
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
    }

    const phoneCheck = normalizeAndValidatePhone(phone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({ success: false, message: phoneCheck.error });
    }

    const standardPhone = phoneCheck.formattedPhone;
    const devOtp = isDevOtpEnabled();
    const otp = devOtp ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({
      phone: { $in: [standardPhone, phoneCheck.raw10, phone.trim()] }
    });

    if (user && user.isDeleted) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    if (!user) {
      // Create user placeholder
      user = new User({
        name: `User ${phoneCheck.raw10.slice(-4)}`,
        phone: standardPhone,
        otpCode: otp,
        otpExpiresAt: otpExpires
      });
    } else {
      user.phone = standardPhone; // ensure standardized
      user.otpCode = otp;
      user.otpExpiresAt = otpExpires;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${standardPhone}`,
      devOtp: devOtp ? otp : undefined
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
      return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
    }

    const phoneCheck = normalizeAndValidatePhone(phone);
    const standardPhone = phoneCheck.isValid ? phoneCheck.formattedPhone : phone.trim();

    const user = await User.findOne({
      phone: { $in: [standardPhone, phoneCheck.raw10, phone.trim()] }
    }).select('+otpCode +otpExpiresAt');

    if (!user || user.isDeleted) {
      return res.status(400).json({ success: false, message: 'User not found or deactivated. Request an OTP first.' });
    }

    // Verify OTP (dev code only allowed outside production)
    const isDevMatch = isDevOtpEnabled() && otp === '123456';
    const isOtpValid = (user.otpCode === otp && user.otpExpiresAt > Date.now()) || isDevMatch;

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Update details
    user.isPhoneVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    if (role && ['tenant', 'owner', 'broker'].includes(role) && user.role !== 'admin') {
      user.role = role;
    }
    if (name) {
      user.name = name;
    }
    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
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

// @desc    Demo Quick Login (Disabled in production unless ENABLE_DEMO_MODE=true)
// @route   POST /api/v1/auth/demo-login
// @access  Development / Demo Only
exports.demoLogin = async (req, res, next) => {
  try {
    if (!isDemoLoginEnabled()) {
      return res.status(403).json({
        success: false,
        message: 'Demo login is disabled in production.'
      });
    }

    const { role = 'tenant' } = req.body;
    if (!['tenant', 'owner', 'broker', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid demo role requested.' });
    }

    // Find first active user with that role or create on-the-fly demo user
    let user = await User.findOne({ role, isDeleted: { $ne: true } });

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
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
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

// @desc    Logout & Clear HttpOnly Cookie
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.clearCookie('rentnest_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get Current Logged In Profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile & Contact Preference / Role
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, contactPreference, brokerDetails, role, phone, otp, password } = req.body;
    const user = await User.findById(req.user.id).select('+otpCode +otpExpiresAt');

    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role && ['tenant', 'owner', 'broker'].includes(role) && user.role !== 'admin') {
      user.role = role;
    }

    if (name !== undefined) {
      if (!name || !name.trim() || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters long' });
      }
      user.name = name.trim();
    }

    if (phone) {
      const phoneCheck = normalizeAndValidatePhone(phone);
      if (!phoneCheck.isValid) {
        return res.status(400).json({ success: false, message: phoneCheck.error });
      }
      if (phoneCheck.formattedPhone !== user.phone) {
        const isDevMatch = isDevOtpEnabled() && otp === '123456';
        const isOtpValid = (otp && user.otpCode === otp && user.otpExpiresAt > Date.now()) || isDevMatch;
        if (!isOtpValid) {
          return res.status(400).json({
            success: false,
            message: 'Changing your phone number requires a valid OTP code.'
          });
        }
        const existingPhone = await User.findOne({
          _id: { $ne: user._id },
          phone: { $in: [phoneCheck.formattedPhone, phoneCheck.raw10] }
        });
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'This phone number is already in use.' });
        }
        user.phone = phoneCheck.formattedPhone;
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
      }
    }

    if (email !== undefined && email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim().toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (password) {
      const passwordCheck = validatePassword(password);
      if (!passwordCheck.isValid) {
        return res.status(400).json({ success: false, message: passwordCheck.error });
      }
      user.password = password;
    }

    if (avatar) user.avatar = avatar;
    if (contactPreference) user.contactPreference = contactPreference;
    if (brokerDetails && user.role === 'broker') {
      user.brokerDetails = { ...user.brokerDetails, ...brokerDetails };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus,
        contactPreference: user.contactPreference,
        brokerDetails: user.brokerDetails,
        city: user.city || 'Rajkot'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Owner Electricity Bill / KYC Document with Intelligent Verification
// @route   POST /api/v1/auth/kyc/submit
// @access  Private
exports.submitKyc = async (req, res, next) => {
  try {
    const { kycDocumentUrl, kycDocumentType = 'electricity_bill', consumerName } = req.body;
    if (!kycDocumentUrl || !kycDocumentUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide document URL / photo' });
    }
    if (consumerName && consumerName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Consumer name must be at least 2 characters long' });
    }

    const user = await User.findById(req.user.id);
    user.kycDocumentUrl = kycDocumentUrl;
    user.kycDocumentType = kycDocumentType;
    user.kycSubmittedAt = new Date();

    const Property = require('../models/Property');
    const { isMatch, confidence } = verifyNameMatch(user.name, consumerName || user.name);

    if (isMatch) {
      // Document name matched landlord account!
      user.verificationStatus = 'verified';
      user.kycVerifiedAt = new Date();
      await user.save();

      // Automatically tag all listings owned by this landlord as Verified!
      await Property.updateMany(
        { owner: user._id },
        { 
          isVerifiedOwner: true,
          ownershipDocumentVerified: true,
          ownershipDocumentUrl: kycDocumentUrl,
          ownershipDocumentType: kycDocumentType,
          verifiedDocumentDetails: {
            consumerName: consumerName || user.name,
            matchConfidence: confidence,
            verifiedAt: new Date(),
            autoVerified: true,
            verificationNote: `Verified via KYC bill matching owner profile (${user.name})`
          }
        }
      );

      return res.status(200).json({
        success: true,
        verified: true,
        matchConfidence: confidence,
        message: `Ownership verified successfully! Name matched with ${confidence}% confidence. Verified badge added to your account & listings!`,
        user: sanitizeUser(user)
      });
    } else {
      user.verificationStatus = 'pending';
      await user.save();

      return res.status(200).json({
        success: true,
        verified: false,
        matchConfidence: confidence,
        message: `Document submitted for manual review. Name on document ("${consumerName}") does not match profile name ("${user.name}").`,
        user: sanitizeUser(user)
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete Current User Account & Deactivate Listings
// @route   DELETE /api/v1/auth/me
// @access  Private
exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    user.isDeleted = true;
    user.deletedAt = now;
    user.kycDocumentUrl = undefined;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.savedProperties = [];
    await user.save();

    const Property = require('../models/Property');
    const SavedSearch = require('../models/SavedSearch');

    await Promise.all([
      Property.updateMany(
        { owner: user._id, isDeleted: { $ne: true } },
        { isDeleted: true, deletedAt: now, deletedBy: user._id, status: 'unlisted' }
      ),
      SavedSearch.updateMany(
        { user: user._id, isDeleted: { $ne: true } },
        { isDeleted: true, deletedAt: now }
      )
    ]);

    res.clearCookie('rentnest_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      success: true,
      message: 'Your account and active listings have been deactivated (soft deleted).'
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
    const pendingUsers = await User.find({
      verificationStatus: 'pending',
      isDeleted: { $ne: true }
    })
      .select('+kycDocumentUrl')
      .sort({ kycSubmittedAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers.map((u) => sanitizeUser(u, { includeKycUrl: true }))
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
    if (!targetUser || targetUser.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    targetUser.verificationStatus = status;
    // Purge raw utility bill URL after review decision for privacy
    targetUser.kycDocumentUrl = undefined;
    if (status === 'verified') {
      targetUser.kycVerifiedAt = new Date();
      // Auto-tag all this owner's properties with the Verified Owner Badge!
      const Property = require('../models/Property');
      await Property.updateMany(
        { owner: targetUser._id, isDeleted: { $ne: true } },
        { isVerifiedOwner: true }
      );
    }
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User KYC ${status} successfully`,
      user: sanitizeUser(targetUser)
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
      User.countDocuments({ isDeleted: { $ne: true } }),
      Property.countDocuments({ status: 'active', isDeleted: { $ne: true } }),
      User.countDocuments({ verificationStatus: 'pending', isDeleted: { $ne: true } }),
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

// @desc    Get Detailed Platform Analytics (Admin)
// @route   GET /api/v1/auth/admin/analytics
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const VisitRequest = require('../models/VisitRequest');

    const [
      usersByRoleAgg,
      deletedUsersCount,
      propertiesByCityAgg,
      propertiesByCategoryAgg,
      quarantinedCount,
      softDeletedPropertiesCount,
      topLocalities,
      visitsByStatusAgg
    ] = await Promise.all([
      User.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.countDocuments({ isDeleted: true }),
      Property.aggregate([
        { $match: { isDeleted: { $ne: true }, status: 'active' } },
        {
          $group: {
            _id: { $ifNull: ['$city', 'Rajkot'] },
            count: { $sum: 1 },
            avgRent: { $avg: '$pricing.monthlyRent' },
            verifiedCount: { $sum: { $cond: ['$isVerifiedOwner', 1, 0] } }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Property.aggregate([
        { $match: { isDeleted: { $ne: true }, status: 'active' } },
        { $group: { _id: { $ifNull: ['$category', 'residential'] }, count: { $sum: 1 } } }
      ]),
      Property.countDocuments({ isQuarantined: true, isDeleted: { $ne: true } }),
      Property.countDocuments({ isDeleted: true }),
      Property.aggregate([
        { $match: { isDeleted: { $ne: true }, status: 'active' } },
        {
          $group: {
            _id: '$locality',
            city: { $first: { $ifNull: ['$city', 'Rajkot'] } },
            count: { $sum: 1 },
            avgRent: { $avg: '$pricing.monthlyRent' },
            minRent: { $min: '$pricing.monthlyRent' },
            maxRent: { $max: '$pricing.monthlyRent' },
            verifiedCount: { $sum: { $cond: ['$isVerifiedOwner', 1, 0] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      VisitRequest.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const usersByRole = { tenant: 0, owner: 0, broker: 0, admin: 0 };
    usersByRoleAgg.forEach((r) => {
      if (r._id) usersByRole[r._id] = r.count;
    });

    const propertiesByCategory = { residential: 0, commercial: 0 };
    propertiesByCategoryAgg.forEach((c) => {
      if (c._id) propertiesByCategory[c._id] = c.count;
    });

    const visitsByStatus = { pending: 0, accepted: 0, rescheduled: 0, declined: 0, completed: 0, cancelled: 0 };
    visitsByStatusAgg.forEach((v) => {
      if (v._id) visitsByStatus[v._id] = v.count;
    });

    res.status(200).json({
      success: true,
      analytics: {
        usersByRole,
        deletedUsersCount,
        propertiesByCity: propertiesByCityAgg,
        propertiesByCategory,
        quarantinedCount,
        softDeletedPropertiesCount,
        topLocalities,
        visitsByStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List All Users with Search & Filters (Admin)
// @route   GET /api/v1/auth/admin/users
// @access  Private (Admin)
exports.getAdminUsers = async (req, res, next) => {
  try {
    const { role, status = 'active', search } = req.query;
    const query = {};

    if (status === 'deleted') {
      query.isDeleted = true;
    } else if (status !== 'all') {
      query.isDeleted = { $ne: true };
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search && search.trim()) {
      const safe = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { phone: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
        { city: { $regex: safe, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).limit(200);

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((u) => sanitizeUser(u))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create User (Admin CRUD)
// @route   POST /api/v1/auth/admin/users
// @access  Private (Admin)
exports.createAdminUser = async (req, res, next) => {
  try {
    const { name, phone, email, password, role = 'tenant', city = 'Rajkot', verificationStatus = 'unverified' } = req.body;

    if (!name || !name.trim() || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters.' });
    }

    const phoneCheck = normalizeAndValidatePhone(phone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({ success: false, message: phoneCheck.error });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ success: false, message: passwordCheck.error });
    }

    if (!['tenant', 'owner', 'broker', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    const existingPhone = await User.findOne({
      phone: { $in: [phoneCheck.formattedPhone, phoneCheck.raw10, phone.trim()] }
    });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'A user with this phone number already exists.' });
    }

    if (email && email.trim()) {
      const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }
    }

    const created = await User.create({
      name: name.trim(),
      phone: phoneCheck.formattedPhone,
      email: email && email.trim() ? email.trim().toLowerCase() : undefined,
      password,
      role,
      city: city || 'Rajkot',
      isPhoneVerified: true,
      verificationStatus: ['unverified', 'pending', 'verified', 'rejected'].includes(verificationStatus)
        ? verificationStatus
        : 'unverified'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: sanitizeUser(created)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User or Restore Soft-Deleted User (Admin CRUD)
// @route   PUT /api/v1/auth/admin/users/:id
// @access  Private (Admin)
exports.updateAdminUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, role, city, verificationStatus, restore } = req.body;

    if (name !== undefined) {
      if (!name || !name.trim() || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      }
      targetUser.name = name.trim();
    }

    if (email !== undefined) {
      if (email === '') {
        targetUser.email = undefined;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim().toLowerCase())) {
          return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
        }
        targetUser.email = email.trim().toLowerCase();
      }
    }

    if (role !== undefined) {
      if (!['tenant', 'owner', 'broker', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role.' });
      }
      if (targetUser._id.toString() === req.user.id.toString() && role !== 'admin') {
        return res.status(400).json({ success: false, message: 'You cannot downgrade your own admin role.' });
      }
      targetUser.role = role;
    }

    if (city !== undefined && city.trim()) {
      targetUser.city = city.trim();
    }

    if (verificationStatus !== undefined) {
      if (!['unverified', 'pending', 'verified', 'rejected'].includes(verificationStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid verification status.' });
      }
      targetUser.verificationStatus = verificationStatus;
      if (verificationStatus === 'verified') {
        targetUser.kycVerifiedAt = new Date();
        const Property = require('../models/Property');
        await Property.updateMany(
          { owner: targetUser._id, isDeleted: { $ne: true } },
          { isVerifiedOwner: true }
        );
      }
    }

    if (restore === true && targetUser.isDeleted) {
      targetUser.isDeleted = false;
      targetUser.deletedAt = undefined;
    }

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: restore ? 'User restored successfully' : 'User updated successfully',
      user: sanitizeUser(targetUser)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete User (Admin CRUD)
// @route   DELETE /api/v1/auth/admin/users/:id
// @access  Private (Admin)
exports.softDeleteAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot soft delete your own active admin account here.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser || targetUser.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found or already deactivated' });
    }

    const now = new Date();
    targetUser.isDeleted = true;
    targetUser.deletedAt = now;
    targetUser.kycDocumentUrl = undefined;
    targetUser.otpCode = undefined;
    targetUser.otpExpiresAt = undefined;
    targetUser.savedProperties = [];
    await targetUser.save();

    const Property = require('../models/Property');
    const SavedSearch = require('../models/SavedSearch');

    await Promise.all([
      Property.updateMany(
        { owner: targetUser._id, isDeleted: { $ne: true } },
        { isDeleted: true, deletedAt: now, deletedBy: req.user.id, status: 'unlisted' }
      ),
      SavedSearch.updateMany(
        { user: targetUser._id, isDeleted: { $ne: true } },
        { isDeleted: true, deletedAt: now }
      )
    ]);

    res.status(200).json({
      success: true,
      message: 'User soft deleted and their active listings deactivated.'
    });
  } catch (error) {
    next(error);
  }
};
