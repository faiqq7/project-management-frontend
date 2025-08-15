import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";

function Users() {
  const { fetchWithAuth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    password: "",
    password_confirm: "",
    is_active: true,
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

  // Fetch users
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("/api/v1/auth/manage-users/");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.results || data);
        setError(null);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth("/api/v1/auth/manage-users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [newUser, ...prev]);
        setForm({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          role: "user",
          password: "",
          password_confirm: "",
          is_active: true,
        });
        setShowModal(false);
        setError(null);
      } else {
        const errorData = await res.json();
        setError(
          errorData.details
            ? JSON.stringify(errorData.details)
            : errorData.error,
        );
      }
    } catch (err) {
      setError("Failed to create user");
    }
  };

  const handleEditClick = (user) => {
    setEditForm({
      ...user,
      password: "",
      password_confirm: "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const updateData = { ...editForm };
      // Remove password fields if they're empty
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password_confirm;
      }

      const res = await fetchWithAuth(
        `/api/v1/auth/manage-users/${editForm.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === editForm.id ? updatedUser : u)),
        );
        setShowEditModal(false);
      } else {
        const errorData = await res.json();
        setEditError(
          errorData.details
            ? JSON.stringify(errorData.details)
            : errorData.error,
        );
      }
    } catch (err) {
      setEditError("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetchWithAuth(
        `/api/v1/auth/manage-users/${deleteTarget.id}/`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="p-12 ml-8">Loading users...</div>;

  return (
    <div className="p-12 ml-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users)
              ? users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name?.[0] ||
                                user.username?.[0] ||
                                "U"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.date_joined)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
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
            <h3 className="text-xl font-bold mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label
                  htmlFor="add_username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  id="add_username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="add_email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="add_email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="add_first_name"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="add_first_name"
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add_last_name"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="add_last_name"
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="add_role"
                  className="block text-sm font-medium mb-1"
                >
                  Role
                </label>
                <select
                  id="add_role"
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="add_password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="add_password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="add_password_confirm"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="add_password_confirm"
                  type="password"
                  name="password_confirm"
                  value={form.password_confirm}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  id="add_is_active"
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="add_is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active user
                </label>
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

      {/* Edit User Modal */}
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
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="edit_username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  id="edit_username"
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edit_email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="edit_email"
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit_first_name"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="edit_first_name"
                    type="text"
                    name="first_name"
                    value={editForm.first_name || ""}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit_last_name"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="edit_last_name"
                    type="text"
                    name="last_name"
                    value={editForm.last_name || ""}
                    onChange={handleEditInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit_role"
                  className="block text-sm font-medium mb-1"
                >
                  Role
                </label>
                <select
                  id="edit_role"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="edit_password"
                  className="block text-sm font-medium mb-1"
                >
                  New Password (leave blank to keep current)
                </label>
                <input
                  id="edit_password"
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label
                  htmlFor="edit_password_confirm"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="edit_password_confirm"
                  type="password"
                  name="password_confirm"
                  value={editForm.password_confirm}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="edit_is_active"
                  type="checkbox"
                  name="is_active"
                  checked={editForm.is_active}
                  onChange={handleEditInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="edit_is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active user
                </label>
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
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
                  {editLoading ? "Saving..." : "Save"}
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
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget.username}</span>?
              This action cannot be undone.
            </p>
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
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
