/**
 * Common application constants
 */

export const APP_NAME = "Project Management System";
export const APP_VERSION = "1.0.0";

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 1000,
};

export const DATE_FORMATS = {
  SHORT: "MM/dd/yyyy",
  LONG: "MMMM dd, yyyy",
  ISO: "yyyy-MM-dd",
  DATETIME: "MM/dd/yyyy HH:mm",
  TIME: "HH:mm",
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 150,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const TOAST_POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
};

export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
};

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

/**
 * Get currency symbol by code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
};

/**
 * Check if file type is allowed
 * @param {string} fileType - MIME type of the file
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether file type is allowed
 */
export const isFileTypeAllowed = (fileType, allowedTypes) => {
  return allowedTypes.includes(fileType);
};

/**
 * Check if file size is within limit
 * @param {number} fileSize - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} Whether file size is within limit
 */
export const isFileSizeAllowed = (fileSize, maxSize = FILE_UPLOAD.MAX_SIZE) => {
  return fileSize <= maxSize;
};
