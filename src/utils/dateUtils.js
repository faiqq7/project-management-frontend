/**
 * Date utility functions for consistent date handling across the application
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} dateString - The date to format
 * @param {string} format - The format type ('short', 'long', 'date-only')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = "short") => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const options = {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    "date-only": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  };

  return date.toLocaleDateString("en-US", options[format] || options.short);
};

/**
 * Get the current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Check if a date is today
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Calculate the difference between two dates in days
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date
 * @returns {number} Number of days between dates
 */
export const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end.getTime() - start.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

/**
 * Get the start and end of the current week
 * @returns {Object} Object containing start and end dates
 */
export const getCurrentWeek = () => {
  const today = new Date();
  const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));

  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};

/**
 * Get the start and end of the current month
 * @returns {Object} Object containing start and end dates
 */
export const getCurrentMonth = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};
