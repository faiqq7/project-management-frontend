/**
 * Custom hook for authentication state and operations
 */

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

/**
 * Hook to access authentication context
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

/**
 * Hook to check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const useIsAuthenticated = () => {
  const { access } = useAuth();
  return !!access;
};

/**
 * Hook to check if user has specific role
 * @param {string} requiredRole - Required user role
 * @returns {boolean} Whether user has the required role
 */
export const useHasRole = (requiredRole) => {
  const { userRole } = useAuth();
  return userRole === requiredRole;
};

/**
 * Hook to check if user is admin
 * @returns {boolean} Whether user is admin
 */
export const useIsAdmin = () => {
  const { userRole } = useAuth();
  return userRole === "admin" || userRole === "owner";
};

export default useAuth;
