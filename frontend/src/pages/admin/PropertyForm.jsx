import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgents } from '../../services/agentService';
import { uploadImage, deleteImage } from '../../services/uploadService';
import {
  createProperty,
  updateProperty,
  getAllPropertiesAdmin,
} from '../../services/propertyService';
import AdminHeader from '../../components/admin/AdminHeader';

const EMPTY_FORM = {
  title: '', description: '', propertyType: 'house', listingType: 'for-sale',
  price: '', bedrooms: 0, bathrooms: 0, parkingSpaces: 0, floorSize: '', erfSize: '',
  address: { street: '', suburb: '', city: '', province: '', postalCode: '' },
  agent: '', status: 'draft', featured: false,
  latitude: '', longitude: '',
};

function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [agents, setAgents] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAgents().then((data) => setAgents(data.agents));

    if (id) {
      getAllPropertiesAdmin().then((data) => {
        const existing = data.properties.find((p) => p._id === id);
        if (existing) {
          const [lng, lat] = existing.location?.coordinates || [];
          setForm({
            ...existing,
            agent: existing.agent._id || existing.agent,
            latitude: lat ?? '',
            longitude: lng ?? '',
          });
          setImages(existing.images || []);
        }
      });
    }
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setImages((prev) => [...prev, { ...uploaded, isPrimary: prev.length === 0 }]);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (publicId) => {
    await deleteImage(publicId);
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const { latitude, longitude, ...rest } = form;
      const payload = {
        ...rest,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        parkingSpaces: Number(form.parkingSpaces),
        floorSize: form.floorSize ? Number(form.floorSize) : undefined,
        erfSize: form.erfSize ? Number(form.erfSize) : undefined,
        images,
        location:
          latitude && longitude
            ? { type: 'Point', coordinates: [Number(longitude), Number(latitude)] }
            : undefined,
      };

      if (id) {
        await updateProperty(id, payload);
      } else {
        await createProperty(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="container section" style={{ maxWidth: '700px' }}>
        <h1>{id ? 'Edit' : 'New'} Property</h1>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} required rows={5} />

          <select value={form.propertyType} onChange={(e) => handleChange('propertyType', e.target.value)}>
            {['house', 'apartment', 'townhouse', 'vacant-land', 'commercial', 'industrial', 'farm'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select value={form.listingType} onChange={(e) => handleChange('listingType', e.target.value)}>
            <option value="for-sale">For Sale</option>
            <option value="to-let">To Let</option>
          </select>

          <input type="number" placeholder="Price" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />

          <div className="form-row">
            <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => handleChange('bedrooms', e.target.value)} />
            <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} />
            <input type="number" placeholder="Parking" value={form.parkingSpaces} onChange={(e) => handleChange('parkingSpaces', e.target.value)} />
          </div>

          <div className="form-row">
            <input type="number" placeholder="Floor size (m²)" value={form.floorSize} onChange={(e) => handleChange('floorSize', e.target.value)} />
            <input type="number" placeholder="Erf size (m²)" value={form.erfSize} onChange={(e) => handleChange('erfSize', e.target.value)} />
          </div>

          <input placeholder="Street" value={form.address.street} onChange={(e) => handleAddressChange('street', e.target.value)} />
          <input placeholder="Suburb" value={form.address.suburb} onChange={(e) => handleAddressChange('suburb', e.target.value)} required />
          <input placeholder="City" value={form.address.city} onChange={(e) => handleAddressChange('city', e.target.value)} required />
          <input placeholder="Province" value={form.address.province} onChange={(e) => handleAddressChange('province', e.target.value)} required />
          <input placeholder="Postal Code" value={form.address.postalCode} onChange={(e) => handleAddressChange('postalCode', e.target.value)} />

          <div className="form-row">
            <input
              type="number"
              step="any"
              placeholder="Latitude (e.g. -26.1234)"
              value={form.latitude}
              onChange={(e) => handleChange('latitude', e.target.value)}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (e.g. 28.1234)"
              value={form.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
            />
          </div>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '-0.5rem' }}>
            Tip: find coordinates by searching the address on{' '}
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>,
            right-clicking the exact spot, and copying the numbers at the top of the menu.
          </p>

          <select value={form.agent} onChange={(e) => handleChange('agent', e.target.value)} required>
            <option value="">Select agent</option>
            {agents.map((a) => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>

          <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="let">Let</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.featured || false}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Featured (show on homepage)
          </label>

          <div>
            <label>Images</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="text-muted">Uploading...</p>}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {images.map((img) => (
                <div key={img.publicId} style={{ position: 'relative' }}>
                  <img src={img.url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.publicId)}
                    className="btn btn-danger"
                    style={{ position: 'absolute', top: 0, right: 0, padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-error">{error}</p>}
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Property'}</button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;