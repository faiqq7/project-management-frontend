import PropTypes from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchWithAuth } = useContext(AuthContext);

  // Fetch all projects from backend on mount
  useEffect(() => {
    setLoading(true);
    fetchWithAuth("/api/v1/projects/")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Extract results array from response
        setProjects(data.results || data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch projects");
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [fetchWithAuth]);

  // Add a new project via backend
  const addProject = async (project) => {
    try {
      const res = await fetchWithAuth("/api/v1/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
      setError(null);
    } catch {
      setError("Failed to add project");
    }
  };

  // Update a project via backend (PUT only)
  const updateProject = async (id, updatedFields) => {
    try {
      const url = `/api/v1/projects/${id}/`;
      const res = await fetchWithAuth(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects((prev) =>
        Array.isArray(prev)
          ? prev.map((p) => (p.id === id ? data : p))
          : [data],
      );
      setError(null);
      return data;
    } catch (err) {
      setError("Failed to update project");
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/v1/projects/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProjects((prev) =>
        Array.isArray(prev) ? prev.filter((p) => p.id !== id) : [],
      );
      setError(null);
    } catch {
      setError("Failed to delete project");
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        setProjects,
        error,
        loading,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

ProjectsProvider.propTypes = {
  children: PropTypes.node,
};

export function useProjects() {
  return useContext(ProjectsContext);
}
