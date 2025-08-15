import {
  Alert,
  Box,
  Button,
  Grid,
  Link as MLink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

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
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
        <Box sx={{ height: "100%", backgroundColor: "#f5f5f5" }}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            alt="Login Visual"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            {showReset ? "Reset Password" : "Login"}
          </Typography>
          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}
          {resetMessage ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetMessage}
            </Alert>
          ) : null}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {!showReset && (
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}
            {showReset && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                />
              </>
            )}
            {!showReset ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Reset Password
              </Button>
            )}
          </Box>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <MLink
              component="button"
              type="button"
              onClick={() => {
                setShowReset(!showReset);
                setError("");
                setResetMessage("");
                setResetUsername(username);
              }}
            >
              {showReset ? "Back to Login" : "Forgot password? Reset here"}
            </MLink>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
