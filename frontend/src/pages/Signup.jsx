import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: '400px' }}>
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          minLength={8}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-error">{error}</p>}
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-muted mt-1">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;