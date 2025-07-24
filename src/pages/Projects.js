import React, { useState } from 'react';
import { useProjects } from '../context/ProjectsContext';
import { Link } from 'react-router-dom';


function Projects() {
    const [sidebarHovered, setSidebarHovered] = useState(false);
    const { projects, addProject, updateProject, deleteProject } = useProjects();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        client_name: '',
        client_email: '',
        billing: 'Hourly',
        rate: '',
        price: '',
        closed_by: '',
        project_lead: '',
        assigned_developer: '',
        start_date: '',
        end_date: '',
    });

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [editError, setEditError] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // For edit modal
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        // Clean form data before sending
        const cleanForm = { ...form };
        ['description', 'price', 'end_date', 'rate'].forEach(field => {
            if (cleanForm[field] === '') cleanForm[field] = null;
        });
        if (cleanForm.start_date && cleanForm.start_date.length === 16) {
            cleanForm.start_date += ':00';
        }
        addProject(cleanForm);
        setForm({
            name: '',
            description: '',
            client_name: '',
            client_email: '',
            billing: 'Hourly',
            rate: '',
            price: '',
            closed_by: '',
            project_lead: '',
            assigned_developer: '',
            start_date: '',
            end_date: '',
        });
        setShowModal(false);
    };

    // Helper to convert ISO datetime to 'YYYY-MM-DDTHH:MM' for datetime-local input
    function toDatetimeLocal(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const pad = n => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    // Helper to format ISO date string to 'DD/MM/YYYY'
    function formatDateDMY(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const pad = n => n < 10 ? '0' + n : n;
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    // Open edit modal
    const handleEditClick = (project) => {
        setEditForm({
            ...project,
            start_date: toDatetimeLocal(project.start_date),
            end_date: project.end_date ? toDatetimeLocal(project.end_date) : '',
        });
        setEditError(null);
        setShowEditModal(true);
    };

    // Submit edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError(null);
        try {
            const updatedForm = { ...editForm };
            if (updatedForm.start_date && updatedForm.start_date.length === 16) {
                updatedForm.start_date += ':00';
            }
            if (updatedForm.end_date && updatedForm.end_date.length === 16) {
                updatedForm.end_date += ':00';
            }
            await updateProject(editForm.id, updatedForm);
            setShowEditModal(false);
        } catch (err) {
            setEditError('Failed to update project');
        } finally {
            setEditLoading(false);
        }
    };

    // Open delete modal
    const handleDeleteClick = (project) => {
        setDeleteTarget(project);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        await deleteProject(deleteTarget.id);
        setDeleteLoading(false);
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    // Cancel delete
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarHovered ? 'ml-56' : 'ml-16'}`}>
                <div className="max-w-5xl mx-auto px-4 pt-8">
                    <div className="flex justify-end mb-6">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                            onClick={() => setShowModal(true)}
                        >
                            Add Project
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Projects</h2>
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <li key={project.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-2">
                                    <Link to={`/projects/${project.id}`} className="font-semibold text-lg text-blue-600 hover:underline">
                                        {project.name}
                                    </Link>
                                    <span className="ml-4 text-gray-500">({project.client})</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                                    <span className="text-sm text-gray-600">Billing: {project.billing}</span>
                                    <span className="text-sm text-gray-600 md:ml-4">Start: {formatDateDMY(project.start_date)}</span>
                                    {/* Edit pencil icon */}
                                    <button
                                        className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                                        title="Edit Project"
                                        onClick={() => handleEditClick(project)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303z" />
                                        </svg>
                                    </button>
                                    {/* Delete trash icon */}
                                    <button
                                        className="ml-2 p-2 rounded-full hover:bg-red-100 focus:outline-none"
                                        title="Delete Project"
                                        onClick={() => handleDeleteClick(project)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Add Project Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 p-2">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative z-40 max-h-screen overflow-y-auto m-4">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4">Add Project</h3>
                            <form onSubmit={handleAddProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Client Name</label>
                                    <input
                                        type="text"
                                        name="client_name"
                                        value={form.client_name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Client Email</label>
                                    <input
                                        type="email"
                                        name="client_email"
                                        value={form.client_email}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Billing Type</label>
                                    <select
                                        name="billing"
                                        value={form.billing}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    >
                                        <option value="Hourly">Hourly</option>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                                {form.billing === 'Hourly' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                                        <input
                                            type="number"
                                            name="rate"
                                            value={form.rate}
                                            onChange={handleInputChange}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}
                                {(form.billing === 'Fixed' || form.billing === 'Yearly') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Total Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleInputChange}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Closed By</label>
                                    <input
                                        type="text"
                                        name="closed_by"
                                        value={form.closed_by}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Lead</label>
                                    <input
                                        type="text"
                                        name="project_lead"
                                        value={form.project_lead}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Assigned Developer</label>
                                    <input
                                        type="text"
                                        name="assigned_developer"
                                        value={form.assigned_developer}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={form.start_date}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={form.end_date}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Edit Project Modal */}
                {showEditModal && editForm && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 p-2">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-screen overflow-y-auto m-4">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                                onClick={() => setShowEditModal(false)}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4">Edit Project</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Client</label>
                                    <input
                                        type="text"
                                        name="client"
                                        value={editForm.client}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Client Email</label>
                                    <input
                                        type="email"
                                        name="client_email"
                                        value={editForm.client_email || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Assigned Developer</label>
                                    <input
                                        type="text"
                                        name="assigned_developer"
                                        value={editForm.assigned_developer || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Lead</label>
                                    <input
                                        type="text"
                                        name="project_lead"
                                        value={editForm.project_lead || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Closed By</label>
                                    <input
                                        type="text"
                                        name="closed_by"
                                        value={editForm.closed_by || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Billing Type</label>
                                    <select
                                        name="billing"
                                        value={editForm.billing}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="Hourly">Hourly</option>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                                {editForm.billing === 'Hourly' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                                        <input
                                            type="number"
                                            name="rate"
                                            value={editForm.rate}
                                            onChange={handleEditInputChange}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}
                                {(editForm.billing === 'Fixed' || editForm.billing === 'Yearly') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Total Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editForm.price}
                                            onChange={handleEditInputChange}
                                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start</label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={editForm.start_date}
                                        onChange={handleEditInputChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                {editError && <div className="text-red-500 text-sm">{editError}</div>}
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                        onClick={() => setShowEditModal(false)}
                                        disabled={editLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={editLoading}
                                    >
                                        {editLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Delete Confirmation Modal */}
                {showDeleteModal && deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-screen overflow-y-auto m-4">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                                onClick={handleCancelDelete}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Project</h3>
                            <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>? This action cannot be undone.</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={handleCancelDelete}
                                    disabled={deleteLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                    onClick={handleConfirmDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;