import { useEffect, useState } from 'react';
import { getEnquiries, updateEnquiryStatus } from '../../services/enquiryService';
import AdminHeader from '../../components/admin/AdminHeader';

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getEnquiries(filter || undefined)
      .then((data) => setEnquiries(data.enquiries))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    await updateEnquiryStatus(id, status);
    load();
  };

  return (
    <div>
      <AdminHeader />
      <div className="container section">
        <h1>Enquiries</h1>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-1">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>

        {loading ? (
          <p className="text-muted mt-2">Loading...</p>
        ) : (
          <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enquiries.map((e) => (
              <div key={e._id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{e.name}</strong>
                  <select value={e.status} onChange={(ev) => handleStatusChange(e._id, ev.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <p className="text-muted">{e.email} {e.phone && `· ${e.phone}`}</p>
                {e.property && <p>Re: {e.property.title}</p>}
                <p>{e.message}</p>
                <small className="text-muted">{new Date(e.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
        {enquiries.length === 0 && !loading && <p className="text-muted">No enquiries.</p>}
      </div>
    </div>
  );
}

export default AdminEnquiries;