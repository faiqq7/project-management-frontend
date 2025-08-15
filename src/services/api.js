/**
 * Base API configuration and utilities
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/api/token/",
  REFRESH: "/api/token/refresh/",
  REGISTER: "/api/auth/register/",

  // Users
  USERS: "/api/v1/auth/users/",
  USER_DETAIL: (id) => `/api/v1/auth/users/${id}/`,

  // Company
  COMPANY_STATS: "/api/v1/company-stats/",
  COMPANY_ROLES: "/api/v1/company-roles/",
  COMPANY_SETTINGS: "/api/v1/company-settings/",

  // Employees
  EMPLOYEES: "/api/v1/employees/",
  EMPLOYEE_DETAIL: (id) => `/api/v1/employees/${id}/`,

  // Projects
  PROJECTS: "/api/v1/projects/",
  PROJECT_DETAIL: (id) => `/api/v1/projects/${id}/`,
  PROJECT_LOGS: (id) => `/api/v1/projects/${id}/logs/`,
  PROJECT_INVOICES: (id) => `/api/v1/projects/${id}/invoices/`,

  // Time Logs
  TIME_LOGS: "/api/v1/timelogs/",
  TIME_LOG_DETAIL: (id) => `/api/v1/timelogs/${id}/`,

  // Invoices
  INVOICES: "/api/v1/invoices/",
  INVOICE_DETAIL: (id) => `/api/v1/invoices/${id}/`,

  // Payroll
  PAYROLLS: "/api/v1/payrolls/",
  PAYROLL_DETAIL: (id) => `/api/v1/payrolls/${id}/`,

  // Expenses
  EXPENSES: "/api/v1/expenses/",
  EXPENSE_DETAIL: (id) => `/api/v1/expenses/${id}/`,

  // Subscriptions
  SUBSCRIPTIONS: "/api/v1/subscriptions/",
  SUBSCRIPTION_DETAIL: (id) => `/api/v1/subscriptions/${id}/`,
};

/**
 * HTTP methods for API calls
 */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Create API request options
 * @param {string} method - HTTP method
 * @param {Object} data - Request data
 * @param {Object} headers - Additional headers
 * @returns {Object} Request options
 */
export const createRequestOptions = (
  method = "GET",
  data = null,
  headers = {},
) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  return options;
};

/**
 * Handle API response and extract data
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Response data or error
 */
export const handleApiResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  let data = null;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return data;
};

/**
 * Create a paginated API request URL
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL with query parameters
 */
export const createPaginatedUrl = (baseUrl, params = {}) => {
  const {
    page = 1,
    pageSize = 20,
    search = "",
    ordering = "",
    ...filters
  } = params;

  const searchParams = new URLSearchParams();

  if (page > 1) searchParams.append("page", page.toString());
  if (pageSize !== 20) searchParams.append("page_size", pageSize.toString());
  if (search) searchParams.append("search", search);
  if (ordering) searchParams.append("ordering", ordering);

  // Add filter parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
