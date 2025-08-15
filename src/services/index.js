/**
 * Service layer exports for centralized API access
 */

// Base API utilities
export * from "./api";

// Service modules
export * as authService from "./authService";
export * as projectService from "./projectService";
export * as timeLogService from "./timeLogService";

// Individual service exports for easier imports
export { default as AuthService } from "./authService";
export { default as ProjectService } from "./projectService";
export { default as TimeLogService } from "./timeLogService";
