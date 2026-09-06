import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" style={{ background: 'var(--color-primary)', position: 'relative' }}>
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white' }} onClick={closeMenu}>
        <Logo size={30} color="white" />
        <span>
          GREENERA
          <div style={{ fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 400 }}>PROPERTIES</div>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="navbar-links navbar-links-desktop">
        <Link to="/" style={{ color: 'white' }}>Home</Link>
        <Link to="/properties" style={{ color: 'white' }}>Properties</Link>
        <Link to="/agents" style={{ color: 'white' }}>Agents</Link>
        <Link to="/contact" style={{ color: 'white' }}>Contact</Link>
       {user?.role === 'admin' || user?.role === 'editor' ? (
  <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
) : user ? (
  <span style={{ color: 'white', opacity: 0.85 }}>Hi, {user.name}</span>
) : (
  <>
    <Link to="/login" style={{ color: 'white' }}>Login</Link>
    <Link to="/signup" style={{ color: 'white' }}>Sign Up</Link>
  </>
)}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        className="navbar-toggle"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        {menuOpen ? '\u2715' : '\u2630'}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="navbar-links-mobile"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-primary)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 2rem 1.5rem',
            gap: '1rem',
            zIndex: 100,
          }}
        >
          <Link to="/" style={{ color: 'white' }} onClick={closeMenu}>Home</Link>
          <Link to="/properties" style={{ color: 'white' }} onClick={closeMenu}>Properties</Link>
          <Link to="/agents" style={{ color: 'white' }} onClick={closeMenu}>Agents</Link>
          <Link to="/contact" style={{ color: 'white' }} onClick={closeMenu}>Contact</Link>
          {user?.role === 'admin' || user?.role === 'editor' ? (
  <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
) : user ? (
  <span style={{ color: 'white', opacity: 0.85 }}>Hi, {user.name}</span>
) : (
  <>
    <Link to="/login" style={{ color: 'white' }} onClick={closeMenu}>
      Login
    </Link>
    <Link to="/signup" style={{ color: 'white' }} onClick={closeMenu}>
      Sign Up
    </Link>
  </>
)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;