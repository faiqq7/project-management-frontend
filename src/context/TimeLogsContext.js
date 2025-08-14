import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const TimeLogsContext = createContext();

// const initialLogs = JSON.parse(localStorage.getItem('timelogs') || '[]');

export function TimeLogsProvider({ children }) {
  const [timeLogs, setTimeLogs] = useState([]); // Only in-memory state
  const { fetchWithAuth } = useContext(AuthContext);

  // Fetch logs from backend
  const fetchLogs = async () => {
    const res = await fetchWithAuth("/api/v1/timelogs/");
    if (res.ok) {
      const data = await res.json();
      setTimeLogs(data.results || data);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchWithAuth]);

  // Add a new time log via backend
  const addTimeLog = async (log) => {
    try {
      const response = await fetchWithAuth("/api/v1/timelogs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error("Failed to add time log");
      const data = await response.json();
      setTimeLogs((prev) =>
        Array.isArray(prev)
          ? [
              ...prev,
              data, // use backend response for consistency
            ]
          : [data],
      );
      return data;
    } catch (err) {
      throw new Error("Failed to add time log");
    }
  };

  const removeTimeLog = async (id) => {
    const res = await fetchWithAuth(`/api/v1/timelogs/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchLogs(); // Re-fetch logs from backend after deletion
    } else {
      alert("Failed to delete time log in backend.");
    }
  };

  const updateTimeLog = async (id, updated) => {
    const res = await fetchWithAuth(`/api/v1/timelogs/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      setTimeLogs((prev) => prev.map((log) => (log.id === id ? data : log)));
    } else {
      alert("Failed to update time log in backend.");
    }
  };

  return (
    <TimeLogsContext.Provider
      value={{ timeLogs, addTimeLog, removeTimeLog, updateTimeLog }}
    >
      {children}
    </TimeLogsContext.Provider>
  );
}

export function useTimeLogs() {
  return useContext(TimeLogsContext);
}
