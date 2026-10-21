const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getLocalityStats,
  reportProperty,
  toggleSaveProperty,
  getSavedProperties,
  verifyPropertyDocument
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/analytics/localities', getLocalityStats);
router.get('/my/listings', protect, getMyProperties);
router.get('/my/saved', protect, getSavedProperties);

router.post('/:id/save', protect, toggleSaveProperty);
router.post('/:id/verify-document', protect, verifyPropertyDocument);
router.post('/:id/report', reportProperty);

router.get('/:idOrSlug', getProperty);

router.post('/', protect, authorize('owner', 'broker', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'broker', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'broker', 'admin'), deleteProperty);

module.exports = router;
