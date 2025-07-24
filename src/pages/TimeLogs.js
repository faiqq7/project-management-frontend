import React, { useState } from 'react';
import { useTimeLogs } from '../context/TimeLogsContext';
import { useProjects } from '../context/ProjectsContext';
import { useInvoices } from '../context/InvoicesContext';
import TimeEntryForm from '../components/TimeEntryForm';
import { useNavigate } from 'react-router-dom';

export default function TimeLogs() {
  const { addTimeLog, timeLogs } = useTimeLogs();
  const { projects } = useProjects();
  const { invoices, addInvoice, updateInvoice } = useInvoices();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  // const { userId } = useContext(AuthContext);

  const handleAddLogClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleLogSubmit = async (log) => {
    try {
      // The log object from TimeEntryForm will have different shapes
      // We construct the payload for the backend here.
      const payload = {
        ...log,
        project: selectedProject.id,
        hours: log.hours ? parseFloat(log.hours) : null, // Handle null hours for Fixed projects
      };
      
      await addTimeLog(payload);

      // --- Existing Invoice Logic ---
      // This can be refactored later if needed.
      const project = selectedProject;
      const logDate = log.date;
      if (project.billing === 'Hourly') {
        // Daily invoice for this project and date
        const dailyInvoices = invoices.filter(inv => inv.projectId === project.id && inv.date === logDate);
        const logsForDay = [
          ...timeLogs,
          { ...log, project: project.name }
        ].filter(l => l.project === project.name && l.date === logDate);
        const totalHours = logsForDay.reduce((sum, l) => sum + Number(l.hours), 0);
        const amount = totalHours * Number(project.rate);
        if (dailyInvoices.length > 0) {
          // Update existing invoice
          updateInvoice(dailyInvoices[0].id, {
            amount,
            logs: logsForDay,
          });
        } else {
          // Create new invoice (backend expects only allowed fields)
          addInvoice({
            project: project.id,
            status: 'Pending',
            note: '',
            amount: amount, // send calculated amount
          });
        }
      } else if (project.billing === 'Fixed') {
        const fixedInvoice = invoices.find(inv => inv.projectId === project.id && inv.type === 'Fixed');
        if (!fixedInvoice) {
          addInvoice({
            project: project.id,
            status: 'Pending',
            note: log.description || '',
            amount: Number(project.price), // send fixed price
          });
        }
      } else if (project.billing === 'Yearly') {
        const logMonth = logDate ? logDate.slice(0, 7) : '';
        const invoiceExists = invoices.some(inv => inv.projectId === project.id && inv.type === 'Yearly' && inv.period === logMonth);
        const is30th = logDate && logDate.endsWith('-30');
        if (!invoiceExists && is30th) {
          addInvoice({
            project: project.id,
            status: 'Pending',
            note: '',
            amount: Number(project.price), // send yearly price
          });
        }
      }
      // --- End of Invoice Logic ---

      setShowModal(false);
      setSelectedProject(null);
    } catch (err) {
      alert('Failed to add time log.');
    }
  };

  const handleViewLogs = (projectId) => {
    navigate(`/time-logs/${projectId}`);
  };

  return (
    <div className="p-12 ml-8">
      <h2 className="text-2xl font-bold mb-4">Time Logs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          // For Fixed projects, check if a log exists
          const hasFixedLog = project.billing === 'Fixed' &&
            timeLogs.some(log => log.project === project.id);

          return (
            <div key={project.id} className="bg-white rounded shadow p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <div className="text-gray-600 mb-1">Client: {project.client}</div>
                <div className="text-gray-600 mb-1">Billing: {project.billing}</div>
                <div className="text-gray-600 mb-1">Start: {project.start}</div>
                {project.billing === 'Hourly' && <div className="text-gray-600 mb-1">Rate: ${project.rate}/hr</div>}
                {(project.billing === 'Fixed' || project.billing === 'Yearly') && <div className="text-gray-600 mb-1">Price: ${project.price}</div>}
              </div>
              <div className="flex gap-2 mt-4">
                {project.billing !== 'Yearly' && !(project.billing === 'Fixed' && hasFixedLog) && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => handleAddLogClick(project)}
                  >
                    Add Log
                  </button>
                )}
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                  onClick={() => handleViewLogs(project.id)}
                >
                  View Logs
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Modal for All Project Types */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Add Log for {selectedProject.name}</h3>
            <TimeEntryForm
              onSubmit={handleLogSubmit}
              billing={selectedProject.billing}
            />
          </div>
        </div>
      )}
    </div>
  );
} 