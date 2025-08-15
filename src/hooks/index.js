/**
 * Custom hooks exports for centralized access
 */

export { useApi, useCrud, usePaginatedApi } from "./useApi";
export {
  default as useAuth,
  useHasRole,
  useIsAdmin,
  useIsAuthenticated,
} from "./useAuth";
export {
  default as useDebounce,
  useDebouncedCallback,
  useDebouncedSearch,
} from "./useDebounce";
export {
  useClearLocalStorage,
  default as useLocalStorage,
  useRemoveFromLocalStorage,
} from "./useLocalStorage";
