/**
 * Project status and related constants
 */

export const PROJECT_STATUS = {
  PLANNING: "planning",
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: "Planning",
  [PROJECT_STATUS.ACTIVE]: "Active",
  [PROJECT_STATUS.ON_HOLD]: "On Hold",
  [PROJECT_STATUS.COMPLETED]: "Completed",
  [PROJECT_STATUS.CANCELLED]: "Cancelled",
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.PLANNING]: "#fbbf24", // amber-400
  [PROJECT_STATUS.ACTIVE]: "#10b981", // emerald-500
  [PROJECT_STATUS.ON_HOLD]: "#f59e0b", // amber-500
  [PROJECT_STATUS.COMPLETED]: "#6b7280", // gray-500
  [PROJECT_STATUS.CANCELLED]: "#ef4444", // red-500
};

export const PROJECT_BILLING_TYPES = {
  HOURLY: "hourly",
  FIXED: "fixed",
  RETAINER: "retainer",
};

export const PROJECT_BILLING_LABELS = {
  [PROJECT_BILLING_TYPES.HOURLY]: "Hourly",
  [PROJECT_BILLING_TYPES.FIXED]: "Fixed Price",
  [PROJECT_BILLING_TYPES.RETAINER]: "Retainer",
};

export const PROJECT_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

export const PROJECT_PRIORITY_LABELS = {
  [PROJECT_PRIORITIES.LOW]: "Low",
  [PROJECT_PRIORITIES.MEDIUM]: "Medium",
  [PROJECT_PRIORITIES.HIGH]: "High",
  [PROJECT_PRIORITIES.URGENT]: "Urgent",
};

export const PROJECT_PRIORITY_COLORS = {
  [PROJECT_PRIORITIES.LOW]: "#10b981", // emerald-500
  [PROJECT_PRIORITIES.MEDIUM]: "#f59e0b", // amber-500
  [PROJECT_PRIORITIES.HIGH]: "#f97316", // orange-500
  [PROJECT_PRIORITIES.URGENT]: "#ef4444", // red-500
};

/**
 * Get project status label
 * @param {string} status - Project status
 * @returns {string} Status label
 */
export const getProjectStatusLabel = (status) => {
  return PROJECT_STATUS_LABELS[status] || status;
};

/**
 * Get project status color
 * @param {string} status - Project status
 * @returns {string} Status color
 */
export const getProjectStatusColor = (status) => {
  return PROJECT_STATUS_COLORS[status] || "#6b7280";
};

/**
 * Check if project is active
 * @param {string} status - Project status
 * @returns {boolean} Whether project is active
 */
export const isProjectActive = (status) => {
  return status === PROJECT_STATUS.ACTIVE;
};

/**
 * Check if project is completed
 * @param {string} status - Project status
 * @returns {boolean} Whether project is completed
 */
export const isProjectCompleted = (status) => {
  return [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.CANCELLED].includes(status);
};
