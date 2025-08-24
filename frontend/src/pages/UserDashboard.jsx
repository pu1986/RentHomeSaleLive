import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Paper, Grid, Card, CardMedia, CardContent,
  Chip, Stack, Button, CircularProgress, TextField
} from "@mui/material";

const API = "http://localhost:5000";

const Img = ({ images }) => {
  const src = images && images[0] ? `${API}/uploads/${images[0]}` : "https://source.unsplash.com/collection/483251/800x600";
  return <CardMedia component="img" height="140" image={src} alt="property" />;
};

export default function UserDashboard() {
  const [token] = useState(() => localStorage.getItem("rhs_token") || "");
  const [user] = useState(() => JSON.parse(localStorage.getItem("rhs_user") || "{}"));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({ old: "", newPass: "" });
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || "", mobile: user?.mobile || "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  // Load only logged-in user's properties
  const loadMyProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/properties/my-properties`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyProperties();
  }, []);

  // Change password
  const changePassword = async () => {
    if (!passwords.old || !passwords.newPass) return alert("Please fill both fields");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/change-password`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(passwords)
      });
      if (!res.ok) throw new Error("Failed");
      alert("Password updated successfully");
      setPasswords({ old: "", newPass: "" });
    } catch (err) {
      console.error(err);
      alert("Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async () => {
  setSavingProfile(true);
  try {
    const res = await fetch(`${API}/api/users/profile`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Update failed");
    const data = await res.json();

    // update local storage + state
    localStorage.setItem("rhs_user", JSON.stringify(data));
    alert("Profile updated!");
  } catch (err) {
    console.error(err);
    alert("Profile update failed");
  } finally {
    setSavingProfile(false);
  }
};

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Dashboard</Typography>

      {/* Profile Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Profile Info</Typography>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Mobile: {user?.mobile || "Not provided"}</Typography>
      </Paper>

      {/* Password Change */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Change Password</Typography>
        <Stack spacing={2} direction="row">
          <TextField
            label="Old Password"
            type="password"
            value={passwords.old}
            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
          />
          <TextField
            label="New Password"
            type="password"
            value={passwords.newPass}
            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
          />
          <Button variant="contained" onClick={changePassword} disabled={saving}>
            {saving ? "Saving..." : "Update"}
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Edit Profile</Typography>
        <Stack spacing={2} direction="row">
            <TextField
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <TextField
            label="Mobile"
            value={profile.mobile}
            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
            />
            <Button variant="contained" onClick={updateProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save"}
            </Button>
        </Stack>
    </Paper>

      {/* Properties */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>My Properties</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!properties.length && !loading && <Typography>No properties found</Typography>}

        <Grid container spacing={2}>
          {properties.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card sx={{ borderRadius: 3, border: p.isPremium ? "2px solid gold" : "none" }}>
                <Img images={p.images} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>{p.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{p.locality}, {p.city}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label={p.purpose?.toUpperCase()} size="small" />
                    <Chip label={p.status} size="small" />
                    {p.isPremium && <Chip label="PREMIUM" color="warning" size="small" />}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
