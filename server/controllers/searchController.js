const SavedSearch = require('../models/SavedSearch');
const { normalizeAndValidatePhone } = require('../utils/helpers');

// @desc    Save Search Criteria with WhatsApp / Email Alert Subscription
// @route   POST /api/v1/searches
// @access  Private
exports.saveSearch = async (req, res, next) => {
  try {
    const { criteria, alertChannels, phone } = req.body;

    if (alertChannels?.whatsapp && phone) {
      const phoneCheck = normalizeAndValidatePhone(phone);
      if (!phoneCheck.isValid) {
        return res.status(400).json({ success: false, message: phoneCheck.error });
      }
    }

    const savedSearch = await SavedSearch.create({
      user: req.user.id,
      criteria: criteria || {},
      alertChannels: alertChannels || { whatsapp: true, email: true, webPush: true }
    });

    res.status(201).json({
      success: true,
      message: 'Search saved! You will receive WhatsApp alerts when matching homes are posted.',
      savedSearch
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get User's Saved Searches (excluding soft deleted)
// @route   GET /api/v1/searches/my
// @access  Private
exports.getMySavedSearches = async (req, res, next) => {
  try {
    const searches = await SavedSearch.find({
      user: req.user.id,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: searches.length,
      searches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete Saved Search
// @route   DELETE /api/v1/searches/:id
// @access  Private
exports.deleteSavedSearch = async (req, res, next) => {
  try {
    const updated = await SavedSearch.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Saved search not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Saved search removed'
    });
  } catch (error) {
    next(error);
  }
};
