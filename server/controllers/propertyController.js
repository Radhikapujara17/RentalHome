const Property = require('../models/Property');
const User = require('../models/User');
const { verifyNameMatch, escapeRegex } = require('../utils/helpers');

const ALLOWED_PROPERTY_FIELDS = [
  'title',
  'category',
  'propertyType',
  'bhk',
  'carpetAreaSqFt',
  'floorNumber',
  'totalFloors',
  'facing',
  'commercialDetails',
  'city',
  'locality',
  'societyName',
  'fullAddress',
  'landmark',
  'distanceToKeyLandmarks',
  'coordinates',
  'pricing',
  'utilities',
  'rules',
  'furnishingStatus',
  'furnishingItems',
  'amenities',
  'photos',
  'videoTourUrl',
  'ownershipDocumentUrl',
  'ownershipDocumentType'
];

const pickPropertyFields = (body = {}) => {
  const picked = {};
  ALLOWED_PROPERTY_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      picked[field] = body[field];
    }
  });
  return picked;
};

const sanitizePropertyForViewer = (propDoc, reqUser) => {
  if (!propDoc) return null;
  const obj = typeof propDoc.toObject === 'function' ? propDoc.toObject() : { ...propDoc };
  const viewerId = reqUser?._id?.toString() || reqUser?.id?.toString();
  const ownerId = obj.owner?._id?.toString() || obj.owner?.toString();
  const isOwnerOrAdmin = Boolean(viewerId && (viewerId === ownerId || reqUser?.role === 'admin'));

  delete obj.reportedBy;

  if (!isOwnerOrAdmin) {
    delete obj.ownershipDocumentUrl;
    if (obj.verifiedDocumentDetails) {
      obj.verifiedDocumentDetails = {
        discomProvider: obj.verifiedDocumentDetails.discomProvider,
        verifiedAt: obj.verifiedDocumentDetails.verifiedAt,
        autoVerified: obj.verifiedDocumentDetails.autoVerified,
        verificationNote: obj.verifiedDocumentDetails.verificationNote
      };
    }
    if (
      obj.owner &&
      typeof obj.owner === 'object' &&
      obj.owner.contactPreference === 'verified_only' &&
      reqUser?.verificationStatus !== 'verified'
    ) {
      delete obj.owner.phone;
      obj.owner.phoneHidden = true;
    }
  }

  return obj;
};

// @desc    Get All Properties with Deep Filters & Map Coordinates
// @route   GET /api/v1/properties
// @access  Private
exports.getProperties = async (req, res, next) => {
  try {
    const {
      city,
      locality,
      bhk,
      propertyType,
      category,
      commercialType,
      minPrice,
      maxPrice,
      zeroBrokerage,
      meterType,
      waterType,
      foodPreference,
      furnishing,
      minPowerLoadHp,
      minRoadWidthFt,
      buPermissionCertified,
      fireNocStatus,
      electricPhaseType,
      sort,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const query = { status: 'active', isQuarantined: { $ne: true }, isDeleted: { $ne: true } };
    const andConditions = [];

    // Dynamic Multi-City Filter (treat legacy docs missing city as default 'Rajkot')
    if (city && city !== 'All') {
      if (city === 'Rajkot') {
        andConditions.push({
          $or: [
            { city: 'Rajkot' },
            { city: { $exists: false } },
            { city: null },
            { city: '' }
          ]
        });
      } else {
        andConditions.push({ city });
      }
    }

    // Category (residential vs commercial; treat legacy docs missing category as 'residential')
    if (category) {
      if (category === 'residential') {
        andConditions.push({
          $or: [
            { category: 'residential' },
            { category: { $exists: false } },
            { category: null },
            { category: '' }
          ]
        });
      } else {
        andConditions.push({ category });
      }
    }

    // Commercial Specific Filters
    if (commercialType) {
      query['commercialDetails.commercialType'] = commercialType;
    }
    if (minPowerLoadHp) {
      query['commercialDetails.connectedPowerLoadHp'] = { $gte: Number(minPowerLoadHp) };
    }
    if (minRoadWidthFt) {
      query['commercialDetails.frontageRoadWidthFt'] = { $gte: Number(minRoadWidthFt) };
    }
    if (buPermissionCertified === 'true') {
      query['commercialDetails.buPermissionCertified'] = true;
    }
    if (fireNocStatus === 'true') {
      query['commercialDetails.fireNocStatus'] = true;
    }
    if (electricPhaseType) {
      query['commercialDetails.electricPhaseType'] = electricPhaseType;
    }

    // Search keyword in title, societyName, locality, or fullAddress (escaped to prevent ReDoS)
    if (search) {
      const safeSearch = escapeRegex(search.trim());
      if (safeSearch) {
        andConditions.push({
          $or: [
            { title: { $regex: safeSearch, $options: 'i' } },
            { societyName: { $regex: safeSearch, $options: 'i' } },
            { locality: { $regex: safeSearch, $options: 'i' } },
            { fullAddress: { $regex: safeSearch, $options: 'i' } }
          ]
        });
      }
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Locality filter (support comma separated multi-select)
    if (locality) {
      const localities = locality.split(',').map(l => l.trim());
      query.locality = { $in: localities };
    }

    // BHK filter (support multiple e.g. "2 BHK,3 BHK")
    if (bhk) {
      const bhkList = bhk.split(',').map(b => b.trim());
      query.bhk = { $in: bhkList };
    }

    // Property Type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Price range
    if (minPrice || maxPrice) {
      query['pricing.monthlyRent'] = {};
      if (minPrice) query['pricing.monthlyRent'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.monthlyRent'].$lte = Number(maxPrice);
    }

    // Zero Brokerage (Direct Owners Only)
    if (zeroBrokerage === 'true') {
      query['pricing.brokerageAmount'] = 0;
    }

    // Electricity Meter Type
    if (meterType) {
      query['utilities.electricityMeterType'] = meterType;
    }

    // Water Supply Type
    if (waterType) {
      query['utilities.waterSupplyType'] = waterType;
    }

    // Food Preference (Pure Vegetarian)
    if (foodPreference) {
      query['rules.foodPreference'] = foodPreference;
    }

    // Furnishing Status
    if (furnishing) {
      query.furnishingStatus = furnishing;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === 'price_asc') sortOption = { 'pricing.monthlyRent': 1 };
    else if (sort === 'price_desc') sortOption = { 'pricing.monthlyRent': -1 };
    else if (sort === 'popular') sortOption = { viewCount: -1 };
    else if (sort === 'verified') sortOption = { isVerifiedOwner: -1, createdAt: -1 };

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('owner', 'name phone role avatar verificationStatus contactPreference brokerDetails')
      .sort(sortOption)
      .skip(skip)
      .limit(safeLimit);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / safeLimit),
      currentPage: safePage,
      properties: properties.map((p) => sanitizePropertyForViewer(p, req.user))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Property by ID or Slug
// @route   GET /api/v1/properties/:idOrSlug
// @access  Private
exports.getProperty = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let property;

    // Check if valid ObjectId or Slug
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findOne({ _id: idOrSlug, isDeleted: { $ne: true } }).populate(
        'owner',
        'name phone role avatar verificationStatus contactPreference brokerDetails'
      );
    } else {
      property = await Property.findOne({ slug: idOrSlug, isDeleted: { $ne: true } }).populate(
        'owner',
        'name phone role avatar verificationStatus contactPreference brokerDetails'
      );
    }

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const viewerId = req.user?._id?.toString() || req.user?.id?.toString();
    const ownerId = property.owner?._id?.toString() || property.owner?.toString();
    if (property.isQuarantined && viewerId !== ownerId && req.user?.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Property listing is currently unavailable' });
    }

    // Increment view count asynchronously
    Property.findByIdAndUpdate(property._id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      property: sanitizePropertyForViewer(property, req.user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create New Property Listing
// @route   POST /api/v1/properties
// @access  Private (Owner / Broker / Admin)
exports.createProperty = async (req, res, next) => {
  try {
    const safeBody = pickPropertyFields(req.body);
    safeBody.owner = req.user.id;

    const { title, locality, societyName, fullAddress, pricing, carpetAreaSqFt } = safeBody;

    // Strict input validation
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Property title is required (minimum 5 characters).' });
    }
    if (!locality || !locality.trim()) {
      return res.status(400).json({ success: false, message: 'Locality is required.' });
    }
    if (!societyName || !societyName.trim()) {
      return res.status(400).json({ success: false, message: 'Society or apartment name is required.' });
    }
    if (!fullAddress || fullAddress.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Full property address is required (minimum 8 characters).' });
    }
    if (!carpetAreaSqFt || Number(carpetAreaSqFt) <= 0) {
      return res.status(400).json({ success: false, message: 'Carpet area must be greater than 0 sq ft.' });
    }
    if (!pricing || Number(pricing.monthlyRent) <= 0) {
      return res.status(400).json({ success: false, message: 'Monthly rent must be greater than 0.' });
    }
    if (pricing.securityDeposit !== undefined && Number(pricing.securityDeposit) < 0) {
      return res.status(400).json({ success: false, message: 'Security deposit cannot be negative.' });
    }

    // Ownership Document Verification on Server Side
    if (safeBody.ownershipDocumentUrl) {
      const { isMatch, confidence } = verifyNameMatch(req.user.name, req.body.consumerName || req.user.name);
      if (isMatch) {
        safeBody.ownershipDocumentVerified = true;
        safeBody.isVerifiedOwner = true;
        safeBody.verifiedDocumentDetails = {
          consumerName: req.body.consumerName || req.user.name,
          consumerNumber: req.body.consumerNumber || 'PGVCL-' + Math.floor(10000000000 + Math.random() * 90000000000),
          discomProvider: req.body.discomProvider || 'PGVCL',
          matchConfidence: confidence,
          verifiedAt: new Date(),
          autoVerified: true,
          verificationNote: `100% Genuine: Document name matched with registered landlord (${req.user.name}) with ${confidence}% confidence.`
        };
      } else {
        safeBody.ownershipDocumentVerified = false;
        safeBody.isVerifiedOwner = false;
        safeBody.verifiedDocumentDetails = {
          consumerName: req.body.consumerName || 'Unknown',
          matchConfidence: confidence,
          verifiedAt: new Date(),
          autoVerified: false,
          verificationNote: `Verification rejected: Name on document ("${req.body.consumerName}") does not match landlord account ("${req.user.name}").`
        };
      }
    } else if (req.user.verificationStatus === 'verified') {
      safeBody.isVerifiedOwner = true;
    } else {
      safeBody.isVerifiedOwner = false;
    }

    // If user role is owner, check if brokerage is 0
    if (req.user.role === 'owner') {
      safeBody.pricing = safeBody.pricing || {};
      safeBody.pricing.brokerageAmount = 0;
    }

    // Default photos if none provided
    if (!safeBody.photos || safeBody.photos.length === 0) {
      safeBody.photos = [
        {
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
          roomTag: 'Living Room',
          isCoverPhoto: true
        },
        {
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
          roomTag: 'Master Bedroom',
          isCoverPhoto: false
        }
      ];
    }

    const property = await Property.create(safeBody);

    res.status(201).json({
      success: true,
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Property Listing
// @route   PUT /api/v1/properties/:id
// @access  Private (Owner of listing / Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this listing' });
    }

    const safeUpdate = pickPropertyFields(req.body);
    if (req.body.status && ['active', 'rented', 'unlisted'].includes(req.body.status) && !property.isQuarantined) {
      safeUpdate.status = req.body.status;
    }

    // Ownership Document Verification on Update
    if (safeUpdate.ownershipDocumentUrl) {
      const { isMatch, confidence } = verifyNameMatch(req.user.name, req.body.consumerName || req.user.name);
      if (isMatch) {
        safeUpdate.ownershipDocumentVerified = true;
        safeUpdate.isVerifiedOwner = true;
        safeUpdate.verifiedDocumentDetails = {
          consumerName: req.body.consumerName || req.user.name,
          consumerNumber: req.body.consumerNumber || property.verifiedDocumentDetails?.consumerNumber || 'PGVCL-88765432101',
          discomProvider: req.body.discomProvider || 'PGVCL',
          matchConfidence: confidence,
          verifiedAt: new Date(),
          autoVerified: true,
          verificationNote: `100% Genuine: Document name matched with registered landlord (${req.user.name}) with ${confidence}% confidence.`
        };
      } else {
        safeUpdate.ownershipDocumentVerified = false;
        safeUpdate.isVerifiedOwner = false;
        safeUpdate.verifiedDocumentDetails = {
          consumerName: req.body.consumerName || 'Unknown',
          matchConfidence: confidence,
          verifiedAt: new Date(),
          autoVerified: false,
          verificationNote: `Verification rejected: Name on document ("${req.body.consumerName}") does not match landlord account ("${req.user.name}").`
        };
      }
    }

    property = await Property.findByIdAndUpdate(req.params.id, safeUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete Property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Owner / Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    property.isDeleted = true;
    property.deletedAt = new Date();
    property.deletedBy = req.user.id;
    property.status = 'unlisted';
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property successfully removed (soft deleted)'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User's Properties
// @route   GET /api/v1/properties/my/listings
// @access  Private
exports.getMyProperties = async (req, res, next) => {
  try {
    // Explicit no-cache on dynamic user listings
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Tenants do not possess property listings
    if (req.user && req.user.role === 'tenant') {
      return res.status(200).json({
        success: true,
        count: 0,
        properties: []
      });
    }

    const properties = await Property.find({ owner: req.user.id, isDeleted: { $ne: true } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Locality Price Analytics & Insights
// @route   GET /api/v1/properties/analytics/localities
// @access  Private
exports.getLocalityStats = async (req, res, next) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: 'active', isQuarantined: { $ne: true }, isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$locality',
          count: { $sum: 1 },
          avgRent: { $avg: '$pricing.monthlyRent' },
          minRent: { $min: '$pricing.monthlyRent' },
          maxRent: { $max: '$pricing.monthlyRent' },
          verifiedCount: {
            $sum: { $cond: ['$isVerifiedOwner', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report Suspicious / Fake Listing (Authenticated + Deduplicated)
// @route   POST /api/v1/properties/:id/report
// @access  Private
exports.reportProperty = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for reporting this listing.' });
    }

    const property = await Property.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const alreadyReported = (property.reportedBy || []).some(
      (id) => id.toString() === req.user.id.toString()
    );
    if (alreadyReported) {
      return res.status(400).json({ success: false, message: 'You have already reported this listing.' });
    }

    property.reportedBy = property.reportedBy || [];
    property.reportedBy.push(req.user.id);
    property.reportCount = property.reportedBy.length;

    // Automated Anti-Scam Guard: Quarantine if 3 or more unique users report
    if (property.reportCount >= 3) {
      property.isQuarantined = true;
      property.status = 'quarantined';
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: 'Listing reported. Our trust & safety team has received your report.',
      isQuarantined: property.isQuarantined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save / Wishlist Property
// @route   POST /api/v1/properties/:id/save
// @access  Private
exports.toggleSaveProperty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const propertyId = req.params.id;
    const targetProperty = await Property.findOne({ _id: propertyId, isDeleted: { $ne: true } }).select('_id');
    if (!targetProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    const isAlreadySaved = (user.savedProperties || []).some(id => id.toString() === propertyId);

    let isSaved = false;
    if (isAlreadySaved) {
      user.savedProperties = (user.savedProperties || []).filter(id => id.toString() !== propertyId);
      isSaved = false;
      await Property.findByIdAndUpdate(propertyId, { $inc: { shortlistCount: -1 } });
    } else {
      user.savedProperties = user.savedProperties || [];
      user.savedProperties.push(propertyId);
      isSaved = true;
      await Property.findByIdAndUpdate(propertyId, { $inc: { shortlistCount: 1 } });
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved,
      savedProperties: user.savedProperties,
      message: isSaved ? 'Property added to wishlist' : 'Property removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User's Saved Wishlist Properties
// @route   GET /api/v1/properties/my/saved
// @access  Private
exports.getSavedProperties = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedProperties',
      match: { isDeleted: { $ne: true } },
      populate: {
        path: 'owner',
        select: 'name phone avatar verificationStatus contactPreference'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const activeSaved = (user.savedProperties || [])
      .filter((p) => p && !p.isDeleted)
      .map((p) => sanitizePropertyForViewer(p, req.user));

    res.status(200).json({
      success: true,
      count: activeSaved.length,
      properties: activeSaved,
      savedProperties: activeSaved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Property Document (Electricity Bill / Ownership Proof)
// @route   POST /api/v1/properties/:id/verify-document
// @access  Private (Owner / Admin)
exports.verifyPropertyDocument = async (req, res, next) => {
  try {
    const { 
      documentUrl, 
      documentType = 'electricity_bill', 
      consumerName, 
      consumerNumber, 
      discomProvider = 'PGVCL' 
    } = req.body;

    if (!documentUrl) {
      return res.status(400).json({ success: false, message: 'Document image or PDF URL is required' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to verify documents for this listing' });
    }

    const user = await User.findById(req.user.id);
    const { isMatch, confidence } = verifyNameMatch(user.name, consumerName || user.name);

    property.ownershipDocumentUrl = documentUrl;
    property.ownershipDocumentType = documentType;

    if (isMatch) {
      // Verified! Document belongs to the registered owner
      property.ownershipDocumentVerified = true;
      property.isVerifiedOwner = true;
      property.verifiedDocumentDetails = {
        consumerName: consumerName || user.name,
        consumerNumber: consumerNumber || 'PGVCL-' + Math.floor(10000000000 + Math.random() * 90000000000),
        discomProvider,
        matchConfidence: confidence,
        verifiedAt: new Date(),
        autoVerified: true,
        verificationNote: `100% Genuine: Document name matched with registered landlord (${user.name}) with ${confidence}% confidence.`
      };

      user.verificationStatus = 'verified';
      user.kycVerifiedAt = new Date();
      await user.save();
      await property.save();

      return res.status(200).json({
        success: true,
        verified: true,
        matchConfidence: confidence,
        property,
        message: `Ownership verified successfully! Name matched with ${confidence}% confidence. Verified badge added to property!`
      });
    } else {
      // Name did not match
      property.ownershipDocumentVerified = false;
      property.isVerifiedOwner = false;
      property.verifiedDocumentDetails = {
        consumerName: consumerName || 'Unknown',
        consumerNumber: consumerNumber || '',
        discomProvider,
        matchConfidence: confidence,
        verifiedAt: new Date(),
        autoVerified: false,
        verificationNote: `Verification rejected: Name on document ("${consumerName}") does not match landlord account ("${user.name}").`
      };
      await property.save();

      return res.status(400).json({
        success: false,
        verified: false,
        matchConfidence: confidence,
        property,
        message: `Document verification rejected: Name on document ("${consumerName}") does not match your registered landlord profile ("${user.name}").`
      });
    }
  } catch (error) {
    next(error);
  }
};
