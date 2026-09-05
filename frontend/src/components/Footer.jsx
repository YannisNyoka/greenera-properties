import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer style={{ background: 'var(--color-primary-dark)', color: 'white', padding: '3rem 2rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Logo size={26} color="white" />
            <strong>GREENERA PROPERTIES</strong>
          </div>
          <p style={{ opacity: 0.8, maxWidth: '280px', fontSize: '0.9rem' }}>
            Building homes, empowering families, shaping the future.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.75rem' }}>Explore</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/properties" style={{ color: 'white', opacity: 0.85, textDecoration: 'none' }}>Properties</Link>
            <Link to="/agents" style={{ color: 'white', opacity: 0.85, textDecoration: 'none' }}>Agents</Link>
            <Link to="/contact" style={{ color: 'white', opacity: 0.85, textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.75rem' }}>Contact</h4>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>Johannesburg, South Africa</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} Greenera Properties. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;