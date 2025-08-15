/**
 * Custom hooks for API operations with loading states and error handling
 */

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "./useAuth";

/**
 * Hook for making API calls with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {Array} dependencies - Dependencies for the API call
 * @param {boolean} immediate - Whether to call immediately on mount
 * @returns {Object} API state and methods
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(fetchWithAuth, ...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, fetchWithAuth],
  );

  const depsKey = JSON.stringify(dependencies);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, depsKey]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError,
  };
};

/**
 * Hook for paginated API calls
 * @param {Function} apiFunction - API function that supports pagination
 * @param {Object} initialParams - Initial parameters
 * @returns {Object} Pagination state and methods
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    ...initialParams,
  });
  const { fetchWithAuth } = useAuth();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction(fetchWithAuth, params);

      if (params.page === 1) {
        setData(result.results || result);
      } else {
        setData((prev) => [...prev, ...(result.results || result)]);
      }

      setHasMore(!!result.next);
      setParams((prev) => ({ ...prev, page: prev.page + 1 }));
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiFunction, fetchWithAuth, params, loading, hasMore]);

  const refresh = useCallback(() => {
    setData([]);
    setParams((prev) => ({ ...prev, page: 1 }));
    setHasMore(true);
  }, []);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
    setData([]);
    setHasMore(true);
  }, []);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateParams,
    params,
  };
};

/**
 * Hook for CRUD operations on a resource
 * @param {Object} service - Service object with CRUD methods
 * @returns {Object} CRUD state and methods
 */
export const useCrud = (service) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  const create = useCallback(
    async (itemData) => {
      try {
        setLoading(true);
        const newItem = await service.create(fetchWithAuth, itemData);
        setData((prev) => [newItem, ...prev]);
        return newItem;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchWithAuth],
  );

  const update = useCallback(
    async (id, itemData) => {
      try {
        setLoading(true);
        const updatedItem = await service.update(fetchWithAuth, id, itemData);
        setData((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item)),
        );
        return updatedItem;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchWithAuth],
  );

  const remove = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await service.delete(fetchWithAuth, id);
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchWithAuth],
  );

  const fetch = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const result = await service.getAll(fetchWithAuth, params);
        setData(result.results || result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchWithAuth],
  );

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    fetch,
    setData,
    setError,
  };
};
