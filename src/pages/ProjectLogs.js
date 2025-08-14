import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectsContext";
import { AuthContext } from "../context/AuthContext";

export default function ProjectLogs() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useContext(AuthContext);

  const project = projects.find((p) => String(p.id) === String(projectId));

  const fetchLogs = useCallback(() => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    fetchWithAuth(`/api/v1/timelogs/?project=${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then((data) => setLogs(data.results || data))
      .catch(() => setError("Failed to fetch logs"))
      .finally(() => setLoading(false));
  }, [projectId, fetchWithAuth]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Delete handler for logs
  const handleDeleteLog = async (logId) => {
    const res = await fetchWithAuth(`/api/v1/timelogs/${logId}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchLogs();
    } else {
      alert("Failed to delete log.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate("/time-logs")}
      >
        &larr; Back to Time Logs
      </button>
      {project ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Logs for {project.name}</h2>
          <div className="mb-4 text-gray-600">
            Client: {project.client_name} | Billing: {project.billing}
          </div>
          {loading ? (
            <div className="text-gray-500">Loading logs...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-gray-500">No logs for this project yet.</div>
          ) : (
            <ul className="space-y-3">
              {Array.isArray(logs)
                ? logs.map((log) => (
                    <li
                      key={log.id}
                      className="border rounded p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div>
                          <span className="font-semibold">Date:</span>{" "}
                          {log.date}
                        </div>
                        <div>
                          <span className="font-semibold">Hours:</span>{" "}
                          {log.hours}
                        </div>
                        {log.description && (
                          <div>
                            <span className="font-semibold">Description:</span>{" "}
                            {log.description}
                          </div>
                        )}
                        {log.status && (
                          <div>
                            <span className="font-semibold">Status:</span>{" "}
                            {log.status}
                          </div>
                        )}
                        {log.tags && (
                          <div>
                            <span className="font-semibold">Tags:</span>{" "}
                            {log.tags}
                          </div>
                        )}
                      </div>
                      <button
                        className="mt-2 md:mt-0 md:ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDeleteLog(log.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))
                : null}
            </ul>
          )}
        </>
      ) : (
        <div className="text-red-500">Project not found.</div>
      )}
    </div>
  );
}
