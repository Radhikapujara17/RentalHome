const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const {
  calculateHra,
  generateAgreement,
  generateQrCode,
  uploadImage
} = require('../controllers/toolsController');

router.post('/upload-image', upload.single('image'), uploadImage);
router.post('/hra-calculator', calculateHra);
router.post('/rental-agreement', generateAgreement);
router.post('/qr-code', generateQrCode);

module.exports = router;
