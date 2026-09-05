import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllAgentsAdmin, createAgent, updateAgent } from '../../services/agentService';
import { uploadImage } from '../../services/uploadService';
import AdminHeader from '../../components/admin/AdminHeader';

const EMPTY_FORM = {
  name: '', email: '', phone: '', title: '', bio: '', active: true,
};

function AgentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      getAllAgentsAdmin().then((data) => {
        const existing = data.agents.find((a) => a._id === id);
        if (existing) {
          setForm({
            name: existing.name,
            email: existing.email,
            phone: existing.phone,
            title: existing.title || '',
            bio: existing.bio || '',
            active: existing.active,
          });
          if (existing.photo?.url) setPhoto(existing.photo);
        }
      });
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setPhoto(uploaded);
    } catch (err) {
      setError('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { ...form, photo: photo || undefined };
      if (id) {
        await updateAgent(id, payload);
      } else {
        await createAgent(payload);
      }
      navigate('/admin/agents');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="container section" style={{ maxWidth: '600px' }}>
        <h1>{id ? 'Edit' : 'New'} Agent</h1>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          <input placeholder="Title (e.g. Senior Consultant)" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
          <textarea placeholder="Bio" value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4} />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => handleChange('active', e.target.checked)} />
            Active (visible on public site)
          </label>

          <div>
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
            {uploading && <p className="text-muted">Uploading...</p>}
            {photo && <img src={photo.url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '0.5rem' }} />}
          </div>

          {error && <p className="text-error">{error}</p>}
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Agent'}</button>
        </form>
      </div>
    </div>
  );
}

export default AgentForm;