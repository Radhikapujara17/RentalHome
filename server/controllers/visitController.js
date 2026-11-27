const VisitRequest = require('../models/VisitRequest');
const Property = require('../models/Property');

// @desc    Schedule a physical visit & generate digital visit pass
// @route   POST /api/v1/visits
// @access  Private
exports.createVisitRequest = async (req, res, next) => {
  try {
    const { propertyId, preferredDate, timeSlot, tenantNote } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required.' });
    }

    if (preferredDate) {
      const pDate = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(pDate.getTime()) || pDate < today) {
        return res.status(400).json({ success: false, message: 'Preferred visit date cannot be in the past.' });
      }
    }

    const property = await Property.findById(propertyId);
    if (!property || property.isDeleted || property.isQuarantined) {
      return res.status(404).json({ success: false, message: 'Property not found or unavailable' });
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

    // Role-based status authorization
    const isOwner = visit.owner.toString() === req.user.id;
    const isTenant = visit.tenant.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTenant && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedStatuses = ['pending', 'accepted', 'rescheduled', 'declined', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid visit status' });
    }

    if (!isOwner && !isAdmin) {
      // Tenants may only cancel their own visit request; they cannot self-approve or reschedule owner slots
      if ((status && status !== 'cancelled') || ownerCounterDate || ownerCounterSlot) {
        return res.status(403).json({
          success: false,
          message: 'Only the property owner can approve, reschedule, or complete a visit pass.'
        });
      }
    }

    if (status) visit.status = status;
    if ((isOwner || isAdmin) && ownerCounterDate) visit.ownerCounterDate = ownerCounterDate;
    if ((isOwner || isAdmin) && ownerCounterSlot) visit.ownerCounterSlot = ownerCounterSlot;

    await visit.save();

    res.status(200).json({
      success: true,
      visit
    });
  } catch (error) {
    next(error);
  }
};
