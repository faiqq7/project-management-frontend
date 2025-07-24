import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoicesContext';
import { useProjects } from '../context/ProjectsContext';
import { AuthContext } from '../context/AuthContext';

export default function ProjectInvoices() {
  const { projectId } = useParams();
  const { invoices } = useInvoices();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const { fetchWithAuth } = useContext(AuthContext);

  const project = projects.find(p => String(p.id) === String(projectId));
  const projectInvoices = invoices.filter(inv => String(inv.project) === String(projectId));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/invoices')}
      >
        &larr; Back to All Invoices
      </button>
      {project ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Invoices for {project.name}</h2>
          {projectInvoices.length === 0 ? (
            <div className="text-gray-500">No invoices for this project yet.</div>
          ) : (
            <ul className="space-y-3">
              {projectInvoices.map(inv => (
                <li key={inv.id} className="border rounded p-4 bg-white shadow">
                  <div><span className="font-semibold">Status:</span> {inv.status}</div>
                  <div><span className="font-semibold">Amount:</span> {inv.amount}</div>
                  <div><span className="font-semibold">Note:</span> {inv.note}</div>
                  <div><span className="font-semibold">Created:</span> {inv.created_at}</div>
                  <button
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    onClick={async () => {
                      // Download invoice PDF
                      const res = await fetchWithAuth(`/api/invoices/${inv.id}/download/`, {
                        method: 'GET',
                      });
                      if (res.ok) {
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `invoice_${inv.id}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                      } else {
                        alert('Failed to download invoice PDF.');
                      }
                    }}
                  >
                    Download PDF
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="text-red-500">Project not found.</div>
      )}
    </div>
  );
} 