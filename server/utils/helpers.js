/**
 * Fuzzy Name Matching for Indian / Gujarati Landlord Verification
 * Strips honorifics (Bhai, Ben, Shri, Mr, Mrs, etc.) and compares token overlap.
 */
function verifyNameMatch(userName, documentName) {
  if (!userName || !documentName) return { isMatch: false, confidence: 0 };

  const clean = (str) =>
    str
      .toLowerCase()
      .replace(/\b(mr|mrs|shri|smt|dr|bhai|ben|kumar|lal|das|ji|sheth)\b/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const uClean = clean(userName);
  const dClean = clean(documentName);

  if (uClean === dClean) return { isMatch: true, confidence: 100 };

  const uTokens = uClean.split(' ').filter(Boolean);
  const dTokens = dClean.split(' ').filter(Boolean);

  let matchedTokens = 0;
  for (const t of uTokens) {
    if (dTokens.some(dt => dt === t || dt.includes(t) || t.includes(dt))) {
      matchedTokens++;
    }
  }

  const confidence = Math.round((matchedTokens / Math.max(uTokens.length, 1)) * 100);
  const isMatch = confidence >= 50;

  return { isMatch, confidence };
}

/**
 * Validate and Normalize Phone Number for Indian standard (+91 / 10-digit mobile)
 * Accepts formats: 9876543210, +919876543210, +91 98765 43210, 09876543210
 * Returns { isValid, formattedPhone, raw10, error }
 */
function normalizeAndValidatePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      formattedPhone: '',
      raw10: '',
      error: 'Phone number is required.'
    };
  }

  // Remove spaces, hyphens, and brackets
  let cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, '');

  // Strip international +91 or 91 or leading 0
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Check valid Indian 10-digit mobile: starts with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return {
      isValid: false,
      formattedPhone: '',
      raw10: cleaned,
      error: 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 98765 43210).'
    };
  }

  return {
    isValid: true,
    formattedPhone: `+91${cleaned}`,
    raw10: cleaned,
    error: null
  };
}

/**
 * Validate Password
 * Enforces minimum length of 6 characters and requires both letters and numbers
 * Returns { isValid, error }
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }

  if (password.length > 64) {
    return { isValid: false, error: 'Password cannot exceed 64 characters.' };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter.' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number.' };
  }

  return { isValid: true, error: null };
}

/**
 * Resolve JWT signing secret safely.
 * Fails loudly in production if JWT_SECRET is not configured.
 */
function getJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
    return process.env.JWT_SECRET.trim();
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }
  return process.env.DEV_JWT_SECRET || 'rentnest_local_dev_only_secret_key';
}

/**
 * Escape user input before building MongoDB $regex queries to prevent ReDoS.
 */
function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strip sensitive internal/PII fields from User documents before sending to clients.
 */
function sanitizeUser(userDoc, { includeKycUrl = false } = {}) {
  if (!userDoc) return null;
  const obj = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  delete obj.otpCode;
  delete obj.otpExpiresAt;
  if (!includeKycUrl) {
    delete obj.kycDocumentUrl;
  }
  return obj;
}

module.exports = {
  verifyNameMatch,
  normalizeAndValidatePhone,
  validatePassword,
  getJwtSecret,
  escapeRegex,
  sanitizeUser
};
