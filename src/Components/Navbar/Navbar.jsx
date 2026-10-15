import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'
export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)
  function logout() { onLogout(); close(); navigate('/') }
  return <header className="site-header"><div className="nav-container"><Link className="brand" to="/" onClick={close}><span className="brand-mark" aria-hidden="true">✚</span>StayHealthy.</Link>
    <button className="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>Menu</button>
    <nav aria-label="Main navigation"><ul className={`nav-links ${open ? 'is-open' : ''}`} id="primary-navigation">
      <li><NavLink to="/" onClick={close}>Home</NavLink></li><li><NavLink to="/appointments" onClick={close}>Appointments</NavLink></li><li><NavLink to="/instant-consultation" onClick={close}>Consult now</NavLink></li>
      {user ? <><li><span className="nav-user">Hello, {user.email.split('@')[0]}</span></li><li><button className="button outline" onClick={logout}>Logout</button></li></> : <><li><NavLink to="/signup" onClick={close}>Sign Up</NavLink></li><li><NavLink to="/login" onClick={close}>Login</NavLink></li></>}
    </ul></nav></div></header>
}
