const express = require('express');
const router = express.Router();
const {
  saveSearch,
  getMySavedSearches,
  deleteSavedSearch
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.post('/', protect, saveSearch);
router.get('/my', protect, getMySavedSearches);
router.delete('/:id', protect, deleteSavedSearch);

module.exports = router;
