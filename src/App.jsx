import LandingPage from './Components/Landing_Page/Landing_Page.jsx'
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar.jsx'
import Signup from './Components/Sign_Up/Sign_Up.jsx'
import Login from './Components/Login/Login.jsx'
import BookAppointment from './Components/BookAppointment/BookAppointment.jsx'
import InstantConsultation from './Components/InstantConsultation/InstantConsultation.jsx'
import { API_URL } from './config.js'
import './Components/Navbar/Navbar.css'
import './assets/forms.css'
import './App.css'

function RouteFocus() {
  const { pathname } = useLocation()
  useEffect(() => { document.getElementById('main')?.focus(); window.scrollTo(0, 0) }, [pathname])
  return null
}

function Application() {
  const [user, setUser] = useState(null)
  const [restoring, setRestoring] = useState(true)
  useEffect(() => {
    const controller = new AbortController()
    let token
    try { token = sessionStorage.getItem('auth-token') } catch { /* Memory-only session. */ }
    if (!token) { Promise.resolve().then(() => setRestoring(false)); return () => controller.abort() }
    let active = true
    const timeout = setTimeout(() => { controller.abort(); if (active) setRestoring(false) }, 12000)
    fetch(`${API_URL}/api/auth/user`, { headers: { 'auth-token': token }, signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('Session expired'); return response.json() })
      .then(profile => { if (active) setUser({ ...profile, token }) })
      .catch(error => { if (active && error.name !== 'AbortError') { try { sessionStorage.removeItem('auth-token') } catch { /* No storage. */ } } })
      .finally(() => { clearTimeout(timeout); if (active) setRestoring(false) })
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [])
  function authenticate(profile) {
    try { sessionStorage.setItem('auth-token', profile.token); sessionStorage.setItem('email', profile.email) } catch { /* Memory-only session. */ }
    setUser(profile)
  }
  function logout() {
    try { sessionStorage.removeItem('auth-token'); sessionStorage.removeItem('email') } catch { /* No storage. */ }
    setUser(null)
  }
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar user={user} onLogout={logout} /><main id="main" tabIndex={-1}><RouteFocus />
    {restoring ? <p className="container loading" role="status">Restoring your session…</p> : <Routes>
      <Route path="/" element={<LandingPage />} /><Route path="/signup" element={<Signup onAuthenticated={authenticate} />} /><Route path="/login" element={<Login onAuthenticated={authenticate} />} />
      <Route path="/appointments" element={<BookAppointment key={user?.id || 'guest'} user={user} />} /><Route path="/instant-consultation" element={<InstantConsultation key={user?.id || 'guest'} user={user} />} />
      <Route path="*" element={<section className="container component-intro"><h1>Page not found</h1><Link className="button" to="/">Return home</Link></section>} />
    </Routes>}</main><footer className="site-footer container"><span>StayHealthy · Medical Appointment Booking</span><span>Academic demonstration · Fictional doctors</span></footer></>
}
export default function App() { return <BrowserRouter><Application /></BrowserRouter> }
