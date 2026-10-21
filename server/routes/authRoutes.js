const express = require('express');
const router = express.Router();
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  demoLogin,
  getMe,
  updateProfile,
  submitKyc,
  getPendingKycList,
  reviewKyc,
  getAdminMetrics
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// KYC Document Submission
router.post('/kyc/submit', protect, submitKyc);

// Admin Operations Desk
router.get('/admin/metrics', protect, authorize('admin'), getAdminMetrics);
router.get('/admin/kyc/pending', protect, authorize('admin'), getPendingKycList);
router.put('/admin/kyc/:id/review', protect, authorize('admin'), reviewKyc);

module.exports = router;
