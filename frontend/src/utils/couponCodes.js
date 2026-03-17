// Coupon codes with fixed discount percentages
// These are managed centrally and auto-apply when a valid code is entered
// Add new coupon codes here with their discount percentage

const COUPON_CODES = {
  'Consult2026': 15,
};

/**
 * Look up the discount percentage for a given coupon code
 * @param {string} code - The coupon code to look up
 * @returns {number} - The discount percentage (0 if invalid code)
 */
export function getDiscountForCode(code) {
  if (!code || typeof code !== 'string') return 0;

  // Try exact match first
  if (COUPON_CODES[code] !== undefined) {
    return COUPON_CODES[code];
  }

  // Try case-insensitive match
  const upperCode = code.toUpperCase();
  for (const [key, discount] of Object.entries(COUPON_CODES)) {
    if (key.toUpperCase() === upperCode) {
      return discount;
    }
  }

  return 0;
}

/**
 * Check if a coupon code is valid
 * @param {string} code - The coupon code to check
 * @returns {boolean} - True if the code is valid
 */
export function isValidCode(code) {
  return getDiscountForCode(code) > 0;
}

/**
 * Get all available coupon codes (for admin/reference)
 * Returns unique codes (case-normalized)
 */
export function getAvailableCodes() {
  const uniqueCodes = new Map();
  for (const [code, discount] of Object.entries(COUPON_CODES)) {
    const normalized = code.toUpperCase();
    if (!uniqueCodes.has(normalized)) {
      uniqueCodes.set(normalized, { code, discount });
    }
  }
  return Array.from(uniqueCodes.values());
}
