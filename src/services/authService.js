/**
 * Authentication service for handling login, logout, and user management
 */

import { API_ENDPOINTS, createRequestOptions, handleApiResponse } from "./api";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication tokens and user data
 */
export const login = async (email, password) => {
  const response = await fetch(
    API_ENDPOINTS.LOGIN,
    createRequestOptions("POST", { email, password }),
  );

  return handleApiResponse(response);
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  const response = await fetch(
    API_ENDPOINTS.REGISTER,
    createRequestOptions("POST", userData),
  );

  return handleApiResponse(response);
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access token
 */
export const refreshToken = async (refreshToken) => {
  const response = await fetch(
    API_ENDPOINTS.REFRESH,
    createRequestOptions("POST", { refresh: refreshToken }),
  );

  return handleApiResponse(response);
};

/**
 * Get current user profile
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async (fetchWithAuth) => {
  const response = await fetchWithAuth(API_ENDPOINTS.USERS);
  return handleApiResponse(response);
};

/**
 * Update user profile
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (fetchWithAuth, userId, userData) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.USER_DETAIL(userId),
    createRequestOptions("PUT", userData),
  );

  return handleApiResponse(response);
};

/**
 * Change user password
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} passwordData - Password change data
 * @returns {Promise<Object>} Response
 */
export const changePassword = async (fetchWithAuth, passwordData) => {
  const response = await fetchWithAuth(
    "/api/auth/change-password/",
    createRequestOptions("POST", passwordData),
  );

  return handleApiResponse(response);
};
