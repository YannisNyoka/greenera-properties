import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPropertiesAdmin, deleteProperty } from '../../services/propertyService';
import AdminHeader from '../../components/admin/AdminHeader';

function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = () => {
    setLoading(true);
    getAllPropertiesAdmin()
      .then((data) => setProperties(data.properties))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteProperty(id);
    loadProperties();
  };

  return (
    <div>
      <AdminHeader />
      <div className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Properties</h1>
          <Link to="/admin/properties/new" className="btn">+ Add New Property</Link>
        </div>

        {loading ? (
          <p className="text-muted mt-2">Loading...</p>
        ) : (
          <table className="admin-table mt-2">
            <thead>
              <tr>
                <th>Title</th><th>Status</th><th>Price</th><th>Suburb</th><th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.status}</td>
                  <td>R{p.price.toLocaleString()}</td>
                  <td>{p.address.suburb}</td>
                  <td>
                    <Link to={`/admin/properties/${p._id}/edit`}>Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id, p.title)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {properties.length === 0 && !loading && <p className="text-muted">No properties yet.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;