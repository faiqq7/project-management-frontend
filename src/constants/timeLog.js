/**
 * Time log related constants
 */

export const TIME_LOG_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TIME_LOG_STATUS_LABELS = {
  [TIME_LOG_STATUS.ONGOING]: "On-going",
  [TIME_LOG_STATUS.COMPLETED]: "Completed",
  [TIME_LOG_STATUS.CANCELLED]: "Cancelled",
};

export const TIME_LOG_STATUS_COLORS = {
  [TIME_LOG_STATUS.ONGOING]: "#3b82f6", // blue-500
  [TIME_LOG_STATUS.COMPLETED]: "#10b981", // emerald-500
  [TIME_LOG_STATUS.CANCELLED]: "#ef4444", // red-500
};

export const TIME_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  THIS_WEEK: "this_week",
  LAST_WEEK: "last_week",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_QUARTER: "this_quarter",
  THIS_YEAR: "this_year",
  CUSTOM: "custom",
};

export const TIME_PERIOD_LABELS = {
  [TIME_PERIODS.TODAY]: "Today",
  [TIME_PERIODS.YESTERDAY]: "Yesterday",
  [TIME_PERIODS.THIS_WEEK]: "This Week",
  [TIME_PERIODS.LAST_WEEK]: "Last Week",
  [TIME_PERIODS.THIS_MONTH]: "This Month",
  [TIME_PERIODS.LAST_MONTH]: "Last Month",
  [TIME_PERIODS.THIS_QUARTER]: "This Quarter",
  [TIME_PERIODS.THIS_YEAR]: "This Year",
  [TIME_PERIODS.CUSTOM]: "Custom Range",
};

export const DEFAULT_HOURS_PER_DAY = 8;
export const DEFAULT_DAYS_PER_WEEK = 5;
export const DEFAULT_WEEKS_PER_MONTH = 4.33;

/**
 * Get time log status label
 * @param {string} status - Time log status
 * @returns {string} Status label
 */
export const getTimeLogStatusLabel = (status) => {
  return TIME_LOG_STATUS_LABELS[status] || status;
};

/**
 * Get time log status color
 * @param {string} status - Time log status
 * @returns {string} Status color
 */
export const getTimeLogStatusColor = (status) => {
  return TIME_LOG_STATUS_COLORS[status] || "#6b7280";
};
