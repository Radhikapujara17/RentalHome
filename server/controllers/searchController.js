const SavedSearch = require('../models/SavedSearch');

// @desc    Save Search Criteria with WhatsApp / Email Alert Subscription
// @route   POST /api/v1/searches
// @access  Private
exports.saveSearch = async (req, res, next) => {
  try {
    const { criteria, alertChannels, phone } = req.body;

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

// @desc    Get User's Saved Searches
// @route   GET /api/v1/searches/my
// @access  Private
exports.getMySavedSearches = async (req, res, next) => {
  try {
    const searches = await SavedSearch.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: searches.length,
      searches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Saved Search
// @route   DELETE /api/v1/searches/:id
// @access  Private
exports.deleteSavedSearch = async (req, res, next) => {
  try {
    await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json({
      success: true,
      message: 'Saved search removed'
    });
  } catch (error) {
    next(error);
  }
};
