import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/api/v1/auth/login/", {
        username,
        password,
      });
      login(
        response.data.access,
        response.data.refresh,
        response.data.user.username,
        response.data.user.id,
        response.data.user.role,
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    try {
      const res = await axios.post("/api/v1/auth/reset-password/", {
        username: resetUsername || username,
        password: newPassword,
        password_confirm: newPasswordConfirm,
      });
      if (res.status === 200) {
        setResetMessage("Password reset successful. You can now login.");
        setShowReset(false);
        setPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.response?.data || "Reset failed";
      setError(typeof msg === "string" ? msg : "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Login Visual"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {showReset ? "Reset Password" : "Login"}
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {resetMessage && (
            <p className="text-green-600 mb-4 text-center">{resetMessage}</p>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {!showReset && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          {showReset && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
          {!showReset ? (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Reset Password
            </button>
          )}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setShowReset(!showReset);
                setError("");
                setResetMessage("");
                setResetUsername(username);
              }}
              className="text-blue-600 hover:underline"
            >
              {showReset ? "Back to Login" : "Forgot password? Reset here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
