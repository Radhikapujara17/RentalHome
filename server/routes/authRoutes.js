const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  sendOtp,
  verifyOtp,
  demoLogin,
  getMe,
  updateProfile,
  deleteMe,
  submitKyc,
  getPendingKycList,
  reviewKyc,
  getAdminMetrics,
  getAdminAnalytics,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  softDeleteAdminUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/me', protect, deleteMe);

// KYC Document Submission
router.post('/kyc/submit', protect, submitKyc);

// Admin Operations Desk
router.get('/admin/metrics', protect, authorize('admin'), getAdminMetrics);
router.get('/admin/analytics', protect, authorize('admin'), getAdminAnalytics);
router.get('/admin/users', protect, authorize('admin'), getAdminUsers);
router.post('/admin/users', protect, authorize('admin'), createAdminUser);
router.put('/admin/users/:id', protect, authorize('admin'), updateAdminUser);
router.delete('/admin/users/:id', protect, authorize('admin'), softDeleteAdminUser);
router.get('/admin/kyc/pending', protect, authorize('admin'), getPendingKycList);
router.put('/admin/kyc/:id/review', protect, authorize('admin'), reviewKyc);

module.exports = router;
