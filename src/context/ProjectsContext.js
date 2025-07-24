import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchWithAuth } = useContext(AuthContext);

  // Fetch all projects from backend on mount
  useEffect(() => {
    setLoading(true);
    fetchWithAuth('/api/project/')
      .then(async res => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProjects(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch projects');
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [fetchWithAuth]);

  // Add a new project via backend
  const addProject = async (project) => {
    try {
      const res = await fetchWithAuth('/api/project/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(prev => [...prev, data]);
      setError(null);
    } catch {
      setError('Failed to add project');
    }
  };

  // Update a project via backend (PUT only)
  const updateProject = async (id, updatedFields) => {
    try {
      const url = `/api/project/${id}/`;
      const res = await fetchWithAuth(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      setError(null);
      return data;
    } catch (err) {
      setError('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/project/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setProjects(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch {
      setError('Failed to delete project');
    }
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, setProjects, error, loading }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
} 