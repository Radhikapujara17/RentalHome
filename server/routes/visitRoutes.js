const express = require('express');
const router = express.Router();
const {
  createVisitRequest,
  getMyVisits,
  updateVisitStatus
} = require('../controllers/visitController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createVisitRequest);
router.get('/my', protect, getMyVisits);
router.put('/:id', protect, updateVisitStatus);

module.exports = router;
