/**
 * Project service for managing project-related API calls
 */

import {
  API_ENDPOINTS,
  createPaginatedUrl,
  createRequestOptions,
  handleApiResponse,
} from "./api";

/**
 * Get all projects with optional pagination and filtering
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Projects data
 */
export const getProjects = async (fetchWithAuth, params = {}) => {
  const url = createPaginatedUrl(API_ENDPOINTS.PROJECTS, params);
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
};

/**
 * Get project by ID
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} Project data
 */
export const getProject = async (fetchWithAuth, projectId) => {
  const response = await fetchWithAuth(API_ENDPOINTS.PROJECT_DETAIL(projectId));
  return handleApiResponse(response);
};

/**
 * Create a new project
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project data
 */
export const createProject = async (fetchWithAuth, projectData) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.PROJECTS,
    createRequestOptions("POST", projectData),
  );

  return handleApiResponse(response);
};

/**
 * Update an existing project
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} Updated project data
 */
export const updateProject = async (fetchWithAuth, projectId, projectData) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.PROJECT_DETAIL(projectId),
    createRequestOptions("PUT", projectData),
  );

  return handleApiResponse(response);
};

/**
 * Delete a project
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteProject = async (fetchWithAuth, projectId) => {
  const response = await fetchWithAuth(
    API_ENDPOINTS.PROJECT_DETAIL(projectId),
    createRequestOptions("DELETE"),
  );

  return handleApiResponse(response);
};

/**
 * Get project time logs
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Project logs data
 */
export const getProjectLogs = async (fetchWithAuth, projectId, params = {}) => {
  const url = createPaginatedUrl(API_ENDPOINTS.PROJECT_LOGS(projectId), params);
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
};

/**
 * Get project invoices
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Project invoices data
 */
export const getProjectInvoices = async (
  fetchWithAuth,
  projectId,
  params = {},
) => {
  const url = createPaginatedUrl(
    API_ENDPOINTS.PROJECT_INVOICES(projectId),
    params,
  );
  const response = await fetchWithAuth(url);
  return handleApiResponse(response);
};

/**
 * Get project statistics
 * @param {Function} fetchWithAuth - Authenticated fetch function
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} Project statistics
 */
export const getProjectStats = async (fetchWithAuth, projectId) => {
  const response = await fetchWithAuth(`/api/v1/projects/${projectId}/stats/`);
  return handleApiResponse(response);
};
