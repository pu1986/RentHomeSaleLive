import React, { useState } from 'react'
import { Paper, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false); // ✅ Snackbar open state
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password })
      });
      
      const data = await res.json();
      if (!res.ok) return setMsg(data.message || 'Register failed');

      // ✅ Show snackbar success message
      setOpen(true);

      // 3 sec baad login page pe redirect
      setTimeout(() => nav('/login'), 3000);

    } catch (err) {
      setMsg('Network error');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h6">Register</Typography>
      <form onSubmit={submit}>
        <TextField 
          label="Name" 
          fullWidth 
          sx={{ mt: 2 }} 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <TextField 
          label="Email" 
          type="email"
          fullWidth 
          sx={{ mt: 2 }} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <TextField 
          label="Mobile" 
          type="tel"
          fullWidth 
          sx={{ mt: 2 }} 
          value={mobile} 
          onChange={e => setMobile(e.target.value)} 
          required 
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          sx={{ mt: 2 }} 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Register
        </Button>
        {msg && <Typography color="error" sx={{ mt: 2 }}>{msg}</Typography>}
      </form>

      {/* ✅ Snackbar for success message */}
      <Snackbar 
        open={open} 
        autoHideDuration={3000} 
        onClose={() => setOpen(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          ✅ Please check your email (including junk/spam folder) and verify. 
          After verification you can login and post property, 
          or view owners' contact numbers.
        </Alert>
      </Snackbar>
    </Paper>
  );
}
