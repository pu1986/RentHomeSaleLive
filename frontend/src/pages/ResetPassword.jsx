// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 👇 Backend ka base URL
  const API = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(`${API}/api/users/reset-password/${token}`, {
        password,
      });
      setMessage(data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000); // 2s baad login par bhej do
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Reset Password
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Reset Password
        </Button>
      </form>
    </Container>
  );
}
