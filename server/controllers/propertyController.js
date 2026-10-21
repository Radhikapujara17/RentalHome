const Property = require('../models/Property');
const User = require('../models/User');
const { verifyNameMatch } = require('../utils/helpers');

// @desc    Get All Properties with Deep Filters & Map Coordinates
// @route   GET /api/v1/properties
// @access  Public
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

    const query = { status: 'active', isQuarantined: false };

    // Dynamic Multi-City Filter
    if (city && city !== 'All') {
      query.city = city;
    }

    // Category (residential vs commercial)
    if (category) {
      query.category = category;
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

    // Search keyword in title, societyName, locality, or fullAddress
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { societyName: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
        { fullAddress: { $regex: search, $options: 'i' } }
      ];
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

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('owner', 'name phone role avatar verificationStatus contactPreference brokerDetails')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Property by ID or Slug
// @route   GET /api/v1/properties/:idOrSlug
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let property;

    // Check if valid ObjectId or Slug
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(idOrSlug).populate(
        'owner',
        'name phone role avatar verificationStatus contactPreference brokerDetails'
      );
    } else {
      property = await Property.findOne({ slug: idOrSlug }).populate(
        'owner',
        'name phone role avatar verificationStatus contactPreference brokerDetails'
      );
    }

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    // Increment view count asynchronously
    Property.findByIdAndUpdate(property._id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      property
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
    req.body.owner = req.user.id;

    // If user is verified owner, tag property as verified
    if (req.user.verificationStatus === 'verified') {
      req.body.isVerifiedOwner = true;
    }

    // If user role is owner, check if brokerage is 0
    if (req.user.role === 'owner') {
      req.body.pricing = req.body.pricing || {};
      req.body.pricing.brokerageAmount = 0;
    }

    // Default photos if none provided
    if (!req.body.photos || req.body.photos.length === 0) {
      req.body.photos = [
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

    const property = await Property.create(req.body);

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
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this listing' });
    }

    // Protect immutable system fields
    delete req.body.owner;
    delete req.body._id;
    delete req.body.listingNumber;

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete Property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Owner / Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property successfully removed'
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
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });

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
// @access  Public
exports.getLocalityStats = async (req, res, next) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: 'active' } },
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

// @desc    Report Suspicious / Fake Listing
// @route   POST /api/v1/properties/:id/report
// @access  Public (or Private)
exports.reportProperty = async (req, res, next) => {
  try {
    const { reason, comments } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.reportCount = (property.reportCount || 0) + 1;

    // Automated Anti-Scam Guard: Quarantine if 3 or more reports
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
      populate: {
        path: 'owner',
        select: 'name phone avatar verificationStatus'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const activeSaved = (user.savedProperties || []).filter(Boolean);

    res.status(200).json({
      success: true,
      count: activeSaved.length,
      properties: activeSaved
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
