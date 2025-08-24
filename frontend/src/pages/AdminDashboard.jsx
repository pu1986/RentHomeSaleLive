import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, Chip, Stack, Toolbar, CircularProgress
} from '@mui/material';

const API = 'http://localhost:5000';

const Img = ({ images }) => {
  const src = images && images[0] ? `${API}/uploads/${images[0]}` : 'https://source.unsplash.com/collection/483251/800x600';
  return <CardMedia component="img" height="160" image={src} alt="property" />;
};

export default function AdminDashboard() {
  const [token] = useState(() => localStorage.getItem('rhs_token') || '');
  const [user] = useState(() => JSON.parse(localStorage.getItem('rhs_user') || '{}'));
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = !!user?.isAdmin;
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Load pending properties
  const loadPending = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/properties/admin/pending`, { headers: authHeaders });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  // Load approved properties
  const loadApproved = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/properties?`, { headers: authHeaders });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApproved(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load approved properties');
    } finally {
      setLoading(false);
    }
  };

  // Approve a pending property
  const approveOne = async (id) => {
    if (!window.confirm('Approve this property?')) return;
    try {
      const res = await fetch(`${API}/api/properties/${id}/approve`, {
        method: 'PATCH',
        headers: authHeaders
      });
      if (!res.ok) throw new Error('Approve failed');
      setPending(prev => prev.filter(p => p._id !== id));
      alert('Property approved');
      loadApproved();
    } catch (err) {
      console.error(err);
      alert('Approve failed');
    }
  };

  // Toggle premium for an approved property
  const togglePremium = async (id) => {
    try {
      const res = await fetch(`${API}/api/properties/${id}/premium`, {
        method: 'PATCH',
        headers: authHeaders
      });
      if (!res.ok) throw new Error('Toggle failed');
      loadApproved();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle premium');
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'pending') loadPending();
    else loadApproved();
  }, [tab, isAdmin]);

  if (!isAdmin) {
    return (
      <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" color="error">Access denied</Typography>
        <Typography variant="body2">Admin account required.</Typography>
      </Paper>
    );
  }

  const list = tab === 'pending' ? pending : approved;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Admin Dashboard</Typography>

      <Paper sx={{ p: 1, mb: 2 }}>
        <Toolbar disableGutters sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Button variant={tab === 'pending' ? 'contained' : 'outlined'} onClick={() => setTab('pending')}>Pending</Button>
          <Button variant={tab === 'approved' ? 'contained' : 'outlined'} onClick={() => setTab('approved')}>Approved</Button>
          <Box sx={{ flexGrow: 1 }} />
          {loading && <CircularProgress size={22} />}
        </Toolbar>
      </Paper>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {!list.length && !loading && <Typography>No {tab} properties</Typography>}

      <Grid container spacing={2}>
        {list.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card sx={{ borderRadius: 3, border: p.isPremium ? '2px solid gold' : 'none' }}>
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
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                {tab === 'pending' ? (
                  <Button size="small" variant="contained" onClick={() => approveOne(p._id)}>Approve</Button>
                ) : (
                  <Button size="small" variant={p.isPremium ? 'outlined' : 'contained'} color={p.isPremium ? 'secondary' : 'success'} onClick={() => togglePremium(p._id)}>
                    {p.isPremium ? 'Remove Premium' : 'Make Premium'}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
