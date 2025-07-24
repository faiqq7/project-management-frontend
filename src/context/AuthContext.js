import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Try to get tokens from sessionStorage on first load
  const [access, setAccess] = useState(() => sessionStorage.getItem("access") || null);
  const [refresh, setRefresh] = useState(() => sessionStorage.getItem("refresh") || null);
  const [username, setUsername] = useState(() => sessionStorage.getItem("username") || null);
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || null);

  useEffect(() => {
    if (access) sessionStorage.setItem("access", access);
    else sessionStorage.removeItem("access");
  }, [access]);

  useEffect(() => {
    if (refresh) sessionStorage.setItem("refresh", refresh);
    else sessionStorage.removeItem("refresh");
  }, [refresh]);

  useEffect(() => {
    if (username) sessionStorage.setItem("username", username);
    else sessionStorage.removeItem("username");
  }, [username]);

  useEffect(() => {
    if (userId) sessionStorage.setItem("userId", userId);
    else sessionStorage.removeItem("userId");
  }, [userId]);

  // Accept username and userId in login
  const login = (newAccess, newRefresh, newUsername, newUserId) => {
    setAccess(newAccess);
    setRefresh(newRefresh);
    setUsername(newUsername);
    setUserId(newUserId);
  };
  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUsername(null);
    setUserId(null);
  };

  // Helper to refresh access token
  const refreshAccessToken = async () => {
    if (!refresh) return false;
    try {
      const response = await fetch("/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (response.ok) {
        const data = await response.json();
        setAccess(data.access);
        if (data.refresh) setRefresh(data.refresh); // Update refresh token if provided
        return data.access;
      } else {
        logout();
        return false;
      }
    } catch {
      logout();
      return false;
    }
  };

  // Helper for API calls with auto-refresh
  const fetchWithAuth = async (url, options = {}) => {
    let token = access;
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (res.status === 401 && refresh) {
      // Try to refresh access token
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        res = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ access, refresh, username, userId, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}