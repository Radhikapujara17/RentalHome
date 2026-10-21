const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { uploadStream } = require('../utils/cloudinary');

// @desc    Direct Image Upload (Saves exact photo to local storage + Cloudinary)
// @route   POST /api/v1/tools/upload-image
// @access  Public
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide an image file' });
    }

    // Always save exact user image to local uploads directory
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `prop_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    // Build accessible URL (served via Express /uploads static route)
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const localUrl = `${serverUrl}/uploads/${filename}`;

    let finalUrl = localUrl;

    // Optional Cloudinary sync if valid credentials configured
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'xxgwwlr7') {
        const cRes = await uploadStream(req.file.buffer, 'rentnest_uploads');
        if (cRes && cRes.secure_url && !cRes.public_id?.startsWith('fallback_')) {
          finalUrl = cRes.secure_url;
        }
      }
    } catch (cErr) {
      console.warn('Cloudinary sync skipped; serving stored image:', localUrl);
    }

    res.status(200).json({
      success: true,
      url: finalUrl,
      publicId: filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
};

// @desc    Calculate HRA Tax Exemption and generate receipt preview
// @route   POST /api/v1/tools/hra-calculator
// @access  Public
exports.calculateHra = async (req, res) => {
  try {
    const {
      basicSalary = 50000,
      hraReceived = 20000,
      rentPaid = 15000,
      isMetro = false,
      tenantName = 'Tenant',
      landlordName = 'Landlord',
      propertyAddress = 'Rajkot, Gujarat',
      panNumber = '',
      financialYear = '2026-2027'
    } = req.body;

    const annualBasic = basicSalary * 12;
    const annualHra = hraReceived * 12;
    const annualRent = rentPaid * 12;

    const condition1 = annualHra;
    const condition2 = isMetro ? annualBasic * 0.5 : annualBasic * 0.4;
    const condition3 = Math.max(0, annualRent - annualBasic * 0.1);

    const exemptAmount = Math.min(condition1, condition2, condition3);
    const taxableHra = Math.max(0, annualHra - exemptAmount);
    const requiresLandlordPan = annualRent > 100000;

    // Generate 12 months receipts
    const months = [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March'
    ];

    const receipts = months.map((month, idx) => ({
      receiptNo: `RN-HRA-${idx + 101}`,
      month: `${month} ${idx < 9 ? financialYear.split('-')[0] : financialYear.split('-')[1]}`,
      rentAmount: rentPaid,
      tenantName,
      landlordName,
      propertyAddress,
      landlordPan: requiresLandlordPan ? (panNumber || 'APXXXXXXXX') : 'Not Mandatory (< ₹1L/yr)',
      date: `01-${month.slice(0, 3)}-${idx < 9 ? financialYear.split('-')[0] : financialYear.split('-')[1]}`
    }));

    res.status(200).json({
      success: true,
      data: {
        annualBasic,
        annualHra,
        annualRent,
        exemptAmount,
        taxableHra,
        requiresLandlordPan,
        receipts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Gujarat 11-Month Rental Agreement Draft
// @route   POST /api/v1/tools/rental-agreement
// @access  Public
exports.generateAgreement = async (req, res) => {
  try {
    const {
      landlordName = 'Jayeshbhai Patel',
      landlordAddress = 'Rajkot, Gujarat',
      landlordPhone = '+91 98765 43202',
      tenantName = 'Priya Mehta',
      tenantPermanentAddress = 'Ahmedabad, Gujarat',
      tenantPhone = '+91 98765 43201',
      propertyAddress = 'Flat 402, Radhika Heights, Kalawad Road, Rajkot',
      monthlyRent = 16000,
      securityDeposit = 32000,
      maintenanceAmount = 1500,
      meterType = 'direct_govt_pgvcl',
      subMeterRate = 0,
      lockInPeriodMonths = 6,
      noticePeriodDays = 30,
      startDate = new Date().toISOString().split('T')[0]
    } = req.body;

    const agreementText = `
RESIDENTIAL RENTAL LEASE AGREEMENT (11 MONTHS)
---------------------------------------------------------------
This Tenancy Agreement is entered into on this ${new Date(startDate).toLocaleDateString()} at Rajkot, Gujarat.

BETWEEN:
LESSOR / LANDLORD:
${landlordName}, Residing at: ${landlordAddress}, Phone: ${landlordPhone} (hereinafter called the "FIRST PARTY")

AND

LESSEE / TENANT:
${tenantName}, Permanent Address: ${tenantPermanentAddress}, Phone: ${tenantPhone} (hereinafter called the "SECOND PARTY")

WHEREAS the First Party is the lawful owner of the residential property situated at:
${propertyAddress} (hereinafter referred to as the "SCHEDULE PROPERTY").

NOW THIS AGREEMENT WITNESSETH AS UNDER:
1. TENURE: The lease shall be for an 11-month period commencing from ${new Date(startDate).toLocaleDateString()}.
2. MONTHLY RENT: The Second Party agrees to pay monthly rent of ₹${monthlyRent}/- on or before the 5th day of every calendar month.
3. SECURITY DEPOSIT: The Second Party has paid an interest-free refundable security deposit of ₹${securityDeposit}/- (Rupees Two Months Rent Equivalent), to be refunded upon peaceful handover.
4. SOCIETY MAINTENANCE: Monthly maintenance of ₹${maintenanceAmount}/- shall be borne as per mutual agreement.
5. ELECTRICITY METER REALITY: ${meterType === 'direct_govt_pgvcl' ? 'The property has an independent PGVCL government meter. Tenant shall pay official PGVCL electricity bill directly.' : `The property uses a sub-meter. Tenant shall pay unit consumption at agreed rate of ₹${subMeterRate}/unit.`}
6. NOTICE PERIOD & LOCK-IN: Minimum lock-in period of ${lockInPeriodMonths} months. Either party can terminate tenancy with ${noticePeriodDays} days written notice.
7. USAGE & LIVING RULES: The property is strictly leased for peaceful residential living. Pure vegetarian living preferences and society guidelines to be respected.

Signed and agreed:
Landlord: ____________________       Tenant: ____________________
Witness 1: ___________________       Witness 2: ___________________
    `.trim();

    res.status(200).json({
      success: true,
      agreementText
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate dynamic QR code for printable TO-LET poster
// @route   POST /api/v1/tools/qr-code
// @access  Public
exports.generateQrCode = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    });

    res.status(200).json({
      success: true,
      qrDataUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
