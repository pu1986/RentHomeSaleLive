// pages/Login.jsx
import React, { useState } from 'react'
import { Paper, Typography, TextField, Button } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'   // 🔹 Link import kiya
import { setToken, setUser } from '../App'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return setMsg(data.message || 'Login failed')

      // keep only safe fields
      const userData = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.mobile,
        isAdmin: !!data.user.isAdmin
      }

      setToken(data.token)
      setUser(userData)

      onLogin && onLogin(data.token, userData)
      nav('/')
    } catch (err) {
      setMsg('Network error')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h6">Login</Typography>
      <form onSubmit={submit}>
        <TextField 
          label="Email" 
          fullWidth 
          sx={{ mt: 2 }} 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required 
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          sx={{ mt: 2 }} 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          required 
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
        {msg && <Typography color="error" sx={{ mt: 2 }}>{msg}</Typography>}
      </form>

      {/* 🔹 Forgot password link */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        Forgot your password?{" "}
        <Link to="/forgot-password" style={{ color: "#1976d2", textDecoration: "none" }}>
          Reset here
        </Link>
      </Typography>
    </Paper>
  )
}
