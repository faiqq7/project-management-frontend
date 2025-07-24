import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/project/${projectId}/`)
      .then(res => {
        setProject(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Project not found.");
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="pl-8 pt-8 ml-10">Loading...</div>;
  if (error) return <div className="pl-8 pt-8 ml-10 text-red-500">{error}</div>;
  if (!project) return <div className="pl-8 pt-8 ml-10">Project not found.</div>;

  return (
    <div className="pl-8 pt-8 ml-10">
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <p className="mb-2">Project ID: {project.id}</p>
      <p className="mb-2">Description: {project.description}</p>
      <p className="mb-2">Client Name: {project.client_name}</p>
      <p className="mb-2">Client Email: {project.client_email}</p>
      <p className="mb-2">Billing: {project.billing}</p>
      <p className="mb-2">Rate: {project.rate}</p>
      <p className="mb-2">Price: {project.price}</p>
      <p className="mb-2">Closed By: {project.closed_by}</p>
      <p className="mb-2">Project Lead: {project.project_lead}</p>
      <p className="mb-2">Assigned Developer: {project.assigned_developer}</p>
      <p className="mb-2">Start Date: {project.start_date}</p>
      <p className="mb-2">End Date: {project.end_date || 'N/A'}</p>
      <p className="mb-2">Created At: {project.created_at}</p>
      <p className="mb-2">Updated At: {project.updated_at}</p>
    </div>
  );
}

export default ProjectDetail; 