import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 — Page not found</h1>
      <Link to="/">Back to home</Link>
    </div>
  );
}

export default NotFound;