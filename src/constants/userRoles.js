/**
 * User roles and permissions constants
 */

export const USER_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  CLIENT: "client",
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.OWNER]: [
    "manage_company",
    "manage_users",
    "manage_projects",
    "manage_employees",
    "view_financials",
    "manage_settings",
    "manage_billing",
  ],
  [USER_ROLES.ADMIN]: [
    "manage_users",
    "manage_projects",
    "manage_employees",
    "view_financials",
    "manage_settings",
  ],
  [USER_ROLES.MANAGER]: [
    "manage_projects",
    "view_team_reports",
    "manage_team_time",
  ],
  [USER_ROLES.EMPLOYEE]: ["log_time", "view_own_reports", "edit_own_profile"],
  [USER_ROLES.CLIENT]: ["view_project_reports", "view_invoices"],
};

export const ROLE_LABELS = {
  [USER_ROLES.OWNER]: "Owner",
  [USER_ROLES.ADMIN]: "Administrator",
  [USER_ROLES.MANAGER]: "Manager",
  [USER_ROLES.EMPLOYEE]: "Employee",
  [USER_ROLES.CLIENT]: "Client",
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether the role has the permission
 */
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Check if a role is admin level or higher
 * @param {string} role - User role
 * @returns {boolean} Whether the role is admin level
 */
export const isAdminLevel = (role) => {
  return [USER_ROLES.OWNER, USER_ROLES.ADMIN].includes(role);
};

/**
 * Check if a role can manage other users
 * @param {string} role - User role
 * @returns {boolean} Whether the role can manage users
 */
export const canManageUsers = (role) => {
  return hasPermission(role, "manage_users");
};
