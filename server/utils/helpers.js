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

module.exports = {
  verifyNameMatch
};
