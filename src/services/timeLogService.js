/**
 * Time log service for managing time tracking API calls
 */

import {
  API_ENDPOINTS,
  createPaginatedUrl,
  createRequestOptions,
  handleApiResponse,
} from "./api";

/**
 * Get all time logs with optional pagination and filtering
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Time logs data
 */
export const getTimeLogs = async (fetchWithAuth, params = {}) => {
  const url = createPaginatedUrl(API_ENDPOINTS.TIME_LOGS, params);
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
};

/**
 * Get time log by ID
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} timeLogId - Time log ID
 * @returns {Promise<Object>} Time log data
 */
export const getTimeLog = async (fetchWithAuth, timeLogId) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.TIME_LOG_DETAIL(timeLogId),
  );
  return handleApiResponse(response);
};

/**
 * Create a new time log entry
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} timeLogData - Time log data
 * @returns {Promise<Object>} Created time log data
 */
export const createTimeLog = async (fetchWithAuth, timeLogData) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.TIME_LOGS,
    createRequestOptions("POST", timeLogData),
  );

  return handleApiResponse(response);
};

/**
 * Update an existing time log
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} timeLogId - Time log ID
 * @param {Object} timeLogData - Updated time log data
 * @returns {Promise<Object>} Updated time log data
 */
export const updateTimeLog = async (fetchWithAuth, timeLogId, timeLogData) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.TIME_LOG_DETAIL(timeLogId),
    createRequestOptions("PUT", timeLogData),
  );

  return handleApiResponse(response);
};

/**
 * Delete a time log
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} timeLogId - Time log ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTimeLog = async (fetchWithAuth, timeLogId) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.TIME_LOG_DETAIL(timeLogId),
    createRequestOptions("DELETE"),
  );

  return handleApiResponse(response);
};

/**
 * Get time logs summary for a specific period
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} params - Date range and filtering parameters
 * @returns {Promise<Object>} Time logs summary
 */
export const getTimeLogsSummary = async (fetchWithAuth, params = {}) => {
  const url = createPaginatedUrl("/api/v1/timelogs/summary/", params);
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
};

/**
 * Start a timer for a project
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} timerData - Timer start data
 * @returns {Promise<Object>} Timer response
 */
export const startTimer = async (fetchWithAuth, timerData) => {
  const response = await fetchWithAuth(
    "/api/v1/timelogs/start-timer/",
    createRequestOptions("POST", timerData),
  );

  return handleApiResponse(response);
};

/**
 * Stop the current timer
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} timeLogId - Time log ID
 * @returns {Promise<Object>} Timer response
 */
export const stopTimer = async (fetchWithAuth, timeLogId) => {
  const response = await fetchWithAuth(
    `/api/v1/timelogs/${timeLogId}/stop-timer/`,
    createRequestOptions("POST"),
  );

  return handleApiResponse(response);
};
