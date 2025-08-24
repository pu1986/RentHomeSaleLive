// App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import PropertyDetail from './pages/PropertyDetail'
import PostProperty from './pages/PostProperty'
import UpdateProperty from './pages/UpdateProperty'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from "./pages/AdminDashboard"
import VerifyEmail from "./pages/VerifyEmail";
import UserDashboard from './pages/UserDashboard';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";

export function setToken(t) { localStorage.setItem('rhs_token', t) }
export function getToken() { return localStorage.getItem('rhs_token') }
export function setUser(u) { localStorage.setItem('rhs_user', JSON.stringify(u)) }
export function getUser() { try { return JSON.parse(localStorage.getItem('rhs_user')) } catch { return null } }

// ✅ hard-clear: both local & session, plus optional cookie nuke (frontend side)
export function clearAuth() {
  try {
    localStorage.removeItem('rhs_token');
    localStorage.removeItem('rhs_user');
    sessionStorage.clear();                 // just in case
    document.cookie = 'token=; Max-Age=0; path=/;'; // if you ever set cookie token
  } catch {}
}

export default function App() {
  const [user, setUserState] = useState(getUser())
  const navigate = useNavigate()

  // multi-tab sync: logout in one tab -> sab tabs me reflect
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'rhs_user' || e.key === 'rhs_token') {
        setUserState(getUser())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogin = (token, userObj) => {
    setToken(token)
    setUser(userObj)
    setUserState(userObj)
    navigate('/')
  }

  const handleLogout = () => {
    clearAuth()
    setUserState(null)
    navigate('/login')
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Box sx={{ minHeight: 'calc(100vh - 128px)', mb: 4 }}>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/listings" element={<Listings />} /> */}
            {/* <Route path="/property/:slug" element={<PropertyDetail />} /> */}
            <Route  path="/property/:slug"  element={<PropertyDetail user={user} setUser={setUserState} />}/>
            <Route path="/post-property" element={ user ? <PostProperty /> : <Navigate to="/login" /> } />
            <Route path="/property/:id/update" element={ user ? <UpdateProperty /> : <Navigate to="/login" /> } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={ user ? <Dashboard /> : <Navigate to="/login" /> } />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/user-dashboard" element={ user ? <UserDashboard /> : <Navigate to="/login" /> } />
            <Route path="/admin" element={ user?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" /> } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
