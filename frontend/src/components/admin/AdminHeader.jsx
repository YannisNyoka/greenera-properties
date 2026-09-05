import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ background: 'var(--color-primary-dark)', color: 'white', padding: '1rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, overflowX: 'auto', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
            <Logo size={22} color="white" />
            Admin
          </Link>
          <Link to="/admin" style={{ color: 'white', opacity: 0.85, textDecoration: 'none', fontSize: '0.9rem' }}>Properties</Link>
          <Link to="/admin/agents" style={{ color: 'white', opacity: 0.85, textDecoration: 'none', fontSize: '0.9rem' }}>Agents</Link>
          <Link to="/admin/enquiries" style={{ color: 'white', opacity: 0.85, textDecoration: 'none', fontSize: '0.9rem' }}>Enquiries</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>{user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ borderColor: 'white', color: 'white', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;