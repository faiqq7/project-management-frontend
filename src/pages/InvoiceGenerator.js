import React from 'react';
import { useInvoices } from '../context/InvoicesContext';
import { useProjects } from '../context/ProjectsContext';
import { useNavigate } from 'react-router-dom';

export default function InvoiceGenerator() {
  const { invoices } = useInvoices();
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Get unique project IDs with at least one invoice
  const projectIdsWithInvoices = Array.from(new Set(invoices.map(inv => inv.project)));
  const projectsWithInvoices = projects.filter(p => projectIdsWithInvoices.includes(p.id));

  const printInvoice = (invoiceId) => {
    window.open(`http://127.0.0.1:8000/invoices/${invoiceId}/print/`, '_blank');
  };

  return (
    <div className="p-12 ml-8">
      <h2 className="text-2xl font-bold mb-4">Generated Invoices</h2>
      {projectsWithInvoices.length === 0 ? (
        <div>No invoices generated yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsWithInvoices.map(project => (
            <div key={project.id} className="bg-white rounded shadow p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <div className="text-gray-600 mb-1">Client: {project.client}</div>
                <div className="text-gray-600 mb-1">Billing: {project.billing}</div>
                <div className="text-gray-600 mb-1">Start: {project.start}</div>
                {project.billing === 'Hourly' && <div className="text-gray-600 mb-1">Rate: ${project.rate}/hr</div>}
                {(project.billing === 'Fixed' || project.billing === 'Yearly') && <div className="text-gray-600 mb-1">Price: ${project.price}</div>}
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => navigate(`/invoices/${project.id}`)}
              >
                View Invoices
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 