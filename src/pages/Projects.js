import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";

function Projects() {
  const [sidebarHovered] = useState(false);
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { fetchWithAuth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    client_name: "",
    client_email: "",
    billing: "hourly",
    rate: "",
    price: "",
    closed_by_id: "",
    project_lead_id: "",
    assigned_developer_ids: [],
    start_date: "",
    end_date: "",
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

  // Fetch users for dropdowns
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth("/api/v1/auth/users/");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [fetchWithAuth]);

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
    ["description", "price", "end_date", "rate"].forEach((field) => {
      if (cleanForm[field] === "") cleanForm[field] = null;
    });
    if (cleanForm.start_date && cleanForm.start_date.length === 16) {
      cleanForm.start_date += ":00";
    }

    // Ensure user IDs are integers
    if (cleanForm.project_lead_id) {
      cleanForm.project_lead_id = parseInt(cleanForm.project_lead_id);
    }
    if (cleanForm.closed_by_id) {
      cleanForm.closed_by_id = parseInt(cleanForm.closed_by_id);
    }
    if (
      cleanForm.assigned_developer_ids &&
      cleanForm.assigned_developer_ids.length > 0
    ) {
      cleanForm.assigned_developer_ids = cleanForm.assigned_developer_ids.map(
        (id) => parseInt(id),
      );
    }

    addProject(cleanForm);
    setForm({
      name: "",
      description: "",
      client_name: "",
      client_email: "",
      billing: "hourly",
      rate: "",
      price: "",
      closed_by_id: "",
      project_lead_id: "",
      assigned_developer_ids: [],
      start_date: "",
      end_date: "",
    });
    setShowModal(false);
  };

  // Helper to convert ISO datetime to 'YYYY-MM-DDTHH:MM' for datetime-local input
  function toDatetimeLocal(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // Helper to format ISO date string to 'DD/MM/YYYY'
  function formatDateDMY(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  // Open edit modal
  const handleEditClick = (project) => {
    setEditForm({
      ...project,
      start_date: toDatetimeLocal(project.start_date),
      end_date: project.end_date ? toDatetimeLocal(project.end_date) : "",
      // Convert user objects to user IDs for the form
      project_lead_id: project.project_lead?.id || "",
      assigned_developer_ids:
        project.assigned_developers?.map((dev) => dev.id) || [],
      closed_by_id: project.closed_by?.id || "",
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

      // Handle date fields - convert empty strings to null and add seconds if needed
      if (updatedForm.start_date && updatedForm.start_date.length === 16) {
        updatedForm.start_date += ":00";
      }
      if (updatedForm.end_date) {
        if (updatedForm.end_date.length === 16) {
          updatedForm.end_date += ":00";
        }
      } else if (updatedForm.end_date === "") {
        updatedForm.end_date = null;
      }

      // Clean up other empty string fields
      ["description", "price", "rate"].forEach((field) => {
        if (updatedForm[field] === "") {
          updatedForm[field] = null;
        }
      });

      // Ensure user IDs are integers and clean up nested user objects
      if (updatedForm.project_lead_id) {
        updatedForm.project_lead_id = parseInt(updatedForm.project_lead_id);
      }
      if (updatedForm.closed_by_id) {
        updatedForm.closed_by_id = parseInt(updatedForm.closed_by_id);
      }
      if (
        updatedForm.assigned_developer_ids &&
        updatedForm.assigned_developer_ids.length > 0
      ) {
        updatedForm.assigned_developer_ids =
          updatedForm.assigned_developer_ids.map((id) => parseInt(id));
      }

      // Remove nested user objects that are read-only
      delete updatedForm.project_lead;
      delete updatedForm.assigned_developers;
      delete updatedForm.closed_by;

      await updateProject(editForm.id, updatedForm);
      setShowEditModal(false);
    } catch (err) {
      setEditError("Failed to update project");
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
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${sidebarHovered ? "ml-56" : "ml-16"}`}
      >
        <div className="max-w-5xl mx-auto px-4 pt-8">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h5">Projects</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowModal(true)}
            >
              Add Project
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Billing</TableCell>
                  <TableCell align="right">Rate/Price</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(projects)
                  ? projects.map((project) => (
                      <TableRow key={project.id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Link to={`/projects/${project.id}`}>
                              {project.name}
                            </Link>
                            <Tooltip title="Open">
                              <IconButton
                                size="small"
                                component={Link}
                                to={`/projects/${project.id}`}
                              >
                                <OpenInNewIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell>{project.client_name}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {project.billing}
                        </TableCell>
                        <TableCell align="right">
                          {project.billing === "hourly" && project.rate
                            ? `$${project.rate}/hr`
                            : project.price
                              ? `$${project.price}`
                              : "-"}
                        </TableCell>
                        <TableCell>
                          {formatDateDMY(project.start_date)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(project)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(project)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* Add Project Dialog */}
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Project</DialogTitle>
          <form onSubmit={handleAddProject}>
            <DialogContent dividers>
              <Stack spacing={2}>
                <TextField
                  label="Project Name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Client Name"
                    name="client_name"
                    value={form.client_name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Client Email"
                    name="client_email"
                    value={form.client_email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Stack>
                <FormControl fullWidth>
                  <InputLabel>Billing Type</InputLabel>
                  <Select
                    label="Billing Type"
                    name="billing"
                    value={form.billing}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
                {form.billing === "hourly" ? (
                  <TextField
                    label="Hourly Rate"
                    type="number"
                    name="rate"
                    value={form.rate}
                    onChange={handleInputChange}
                    inputProps={{ step: "0.01", min: 0 }}
                    required
                  />
                ) : (
                  <TextField
                    label="Total Price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    inputProps={{ step: "0.01", min: 0 }}
                    required
                  />
                )}
                <FormControl fullWidth>
                  <InputLabel>Closed By</InputLabel>
                  <Select
                    label="Closed By"
                    name="closed_by_id"
                    value={form.closed_by_id}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select user...</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Project Lead</InputLabel>
                  <Select
                    label="Project Lead"
                    name="project_lead_id"
                    value={form.project_lead_id}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select user...</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Assigned Developer</InputLabel>
                  <Select
                    label="Assigned Developer"
                    name="assigned_developer_ids"
                    value={form.assigned_developer_ids[0] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        assigned_developer_ids: value ? [value] : [],
                      }));
                    }}
                    required
                  >
                    <MenuItem value="">Select developer...</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* Edit Project Modal */}
        <Dialog
          open={showEditModal && !!editForm}
          onClose={() => setShowEditModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Project</DialogTitle>
          {editForm ? (
            <form onSubmit={handleEditSubmit}>
              <DialogContent dividers>
                <Stack spacing={2}>
                  <TextField
                    label="Project Name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditInputChange}
                    required
                  />
                  <TextField
                    label="Client Name"
                    name="client_name"
                    value={editForm.client_name || ""}
                    onChange={handleEditInputChange}
                  />
                  <TextField
                    label="Client Email"
                    name="client_email"
                    value={editForm.client_email || ""}
                    onChange={handleEditInputChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Assigned Developer</InputLabel>
                    <Select
                      label="Assigned Developer"
                      name="assigned_developer_ids"
                      value={editForm.assigned_developer_ids?.[0] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditForm((prev) => ({
                          ...prev,
                          assigned_developer_ids: value ? [value] : [],
                        }));
                      }}
                    >
                      <MenuItem value="">Select developer...</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Project Lead</InputLabel>
                    <Select
                      label="Project Lead"
                      name="project_lead_id"
                      value={editForm.project_lead_id || ""}
                      onChange={handleEditInputChange}
                    >
                      <MenuItem value="">Select user...</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Closed By</InputLabel>
                    <Select
                      label="Closed By"
                      name="closed_by_id"
                      value={editForm.closed_by_id || ""}
                      onChange={handleEditInputChange}
                    >
                      <MenuItem value="">Select user...</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Billing Type</InputLabel>
                    <Select
                      label="Billing Type"
                      name="billing"
                      value={editForm.billing}
                      onChange={handleEditInputChange}
                    >
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="fixed">Fixed</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                  {editForm.billing === "hourly" ? (
                    <TextField
                      label="Hourly Rate"
                      type="number"
                      name="rate"
                      value={editForm.rate || ""}
                      onChange={handleEditInputChange}
                      inputProps={{ step: "0.01", min: 0 }}
                      required
                    />
                  ) : (
                    <TextField
                      label="Total Price"
                      type="number"
                      name="price"
                      value={editForm.price || ""}
                      onChange={handleEditInputChange}
                      inputProps={{ step: "0.01", min: 0 }}
                      required
                    />
                  )}
                  <TextField
                    label="Start"
                    type="datetime-local"
                    name="start_date"
                    value={editForm.start_date}
                    onChange={handleEditInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                {editError ? (
                  <Typography variant="caption" color="error">
                    {editError}
                  </Typography>
                ) : null}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </form>
          ) : null}
        </Dialog>
        {/* Delete Confirmation Modal */}
        <Dialog
          open={showDeleteModal && !!deleteTarget}
          onClose={handleCancelDelete}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Projects;
