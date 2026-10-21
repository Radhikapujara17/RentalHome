const VisitRequest = require('../models/VisitRequest');
const Property = require('../models/Property');

// @desc    Schedule a physical visit & generate digital visit pass
// @route   POST /api/v1/visits
// @access  Private
exports.createVisitRequest = async (req, res, next) => {
  try {
    const { propertyId, preferredDate, timeSlot, tenantNote } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Prevent owner from visiting their own property
    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book a visit for your own property' });
    }

    const visit = await VisitRequest.create({
      property: property._id,
      tenant: req.user.id,
      owner: property.owner,
      preferredDate: preferredDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      timeSlot: timeSlot || 'Evening: 05:00 PM - 07:00 PM',
      tenantNote
    });

    const populatedVisit = await VisitRequest.findById(visit._id)
      .populate('property', 'title locality societyName fullAddress pricing photos listingNumber')
      .populate('owner', 'name phone')
      .populate('tenant', 'name phone');

    res.status(201).json({
      success: true,
      visit: populatedVisit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's visits (as tenant or owner)
// @route   GET /api/v1/visits/my
// @access  Private
exports.getMyVisits = async (req, res, next) => {
  try {
    const visits = await VisitRequest.find({
      $or: [{ tenant: req.user.id }, { owner: req.user.id }]
    })
      .populate('property', 'title locality societyName fullAddress pricing photos listingNumber')
      .populate('owner', 'name phone role avatar')
      .populate('tenant', 'name phone role avatar')
      .sort({ preferredDate: 1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update visit request status (accept, decline, complete)
// @route   PUT /api/v1/visits/:id
// @access  Private
exports.updateVisitStatus = async (req, res, next) => {
  try {
    const { status, ownerCounterDate, ownerCounterSlot } = req.body;

    let visit = await VisitRequest.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ success: false, message: 'Visit request not found' });
    }

    // Only tenant or owner can modify
    const isOwner = visit.owner.toString() === req.user.id;
    const isTenant = visit.tenant.toString() === req.user.id;

    if (!isOwner && !isTenant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (status) visit.status = status;
    if (ownerCounterDate) visit.ownerCounterDate = ownerCounterDate;
    if (ownerCounterSlot) visit.ownerCounterSlot = ownerCounterSlot;

    await visit.save();

    res.status(200).json({
      success: true,
      visit
    });
  } catch (error) {
    next(error);
  }
};
