import { useState } from 'react';
import { submitEnquiry } from '../services/enquiryService';

function EnquiryForm({ propertyId, source = 'contact-page' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      await submitEnquiry({
        ...form,
        property: propertyId || undefined,
        source,
      });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Something went wrong, please try again');
    }
  };

  if (status === 'success') {
    return <p>Thanks — your enquiry has been sent. We'll be in touch soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="form" style={{ maxWidth: '450px' }}>
      <input
        placeholder="Your name"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />
      <input
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <textarea
        placeholder={propertyId ? "I'm interested in this property..." : 'How can we help?'}
        value={form.message}
        onChange={(e) => handleChange('message', e.target.value)}
        rows={4}
        required
      />
      {error && <p className="text-error">{error}</p>}
      <button type="submit" className="btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}

export default EnquiryForm;