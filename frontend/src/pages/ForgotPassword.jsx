// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 👇 baseURL set kar lo
  const API = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/api/users/forgot-password`, { email });
      setMessage(data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Forgot Password
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Send Reset Link
        </Button>
      </form>
    </Container>
  );
}
