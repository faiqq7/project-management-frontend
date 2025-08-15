/**
 * Validation utility functions for form validation and data checking
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;

  if (!password) {
    return { isValid: false, strength: 0, errors: ["Password is required"] };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    strength += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    strength += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    strength += 1;
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    strength += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    strength += 1;
  }

  return {
    isValid: errors.length === 0,
    strength: strength,
    errors: errors,
  };
};

/**
 * Validate required fields in a form
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with errors
 */
export const validateRequired = (formData, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].toString().trim() === "") {
      errors[field] = `${field} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors,
  };
};

/**
 * Validate numeric input
 * @param {string|number} value - Value to validate
 * @param {Object} options - Validation options (min, max, allowDecimals)
 * @returns {Object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, allowDecimals = true } = options;
  const errors = [];

  if (value === "" || value === null || value === undefined) {
    return { isValid: true, errors: [] }; // Allow empty values
  }

  const numValue = Number(value);

  if (isNaN(numValue)) {
    errors.push("Must be a valid number");
    return { isValid: false, errors };
  }

  if (!allowDecimals && numValue % 1 !== 0) {
    errors.push("Must be a whole number");
  }

  if (min !== undefined && numValue < min) {
    errors.push(`Must be at least ${min}`);
  }

  if (max !== undefined && numValue > max) {
    errors.push(`Must be no more than ${max}`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate date input
 * @param {string} dateString - Date string to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateDate = (dateString, options = {}) => {
  const { minDate, maxDate, allowFuture = true, allowPast = true } = options;
  const errors = [];

  if (!dateString) {
    return { isValid: true, errors: [] }; // Allow empty dates
  }

  const date = new Date(dateString);
  const today = new Date();

  if (isNaN(date.getTime())) {
    errors.push("Must be a valid date");
    return { isValid: false, errors };
  }

  if (!allowFuture && date > today) {
    errors.push("Future dates are not allowed");
  }

  if (!allowPast && date < today) {
    errors.push("Past dates are not allowed");
  }

  if (minDate && date < new Date(minDate)) {
    errors.push(`Date must be after ${minDate}`);
  }

  if (maxDate && date > new Date(maxDate)) {
    errors.push(`Date must be before ${maxDate}`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Check if a string contains only alphanumeric characters
 * @param {string} str - String to check
 * @returns {boolean} True if alphanumeric
 */
export const isAlphanumeric = (str) => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
