import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAgentsAdmin, deleteAgent } from '../../services/agentService';
import AdminHeader from '../../components/admin/AdminHeader';

function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAgents = () => {
    setLoading(true);
    getAllAgentsAdmin()
      .then((data) => setAgents(data.agents))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await deleteAgent(id);
      loadAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete agent');
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Agents</h1>
          <Link to="/admin/agents/new" className="btn">+ Add New Agent</Link>
        </div>

        {error && <p className="text-error mt-1">{error}</p>}

        {loading ? (
          <p className="text-muted mt-2">Loading...</p>
        ) : (
          <table className="admin-table mt-2">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Active</th><th></th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a._id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.active ? 'Yes' : 'No'}</td>
                  <td>
                    <Link to={`/admin/agents/${a._id}/edit`}>Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(a._id, a.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {agents.length === 0 && !loading && <p className="text-muted">No agents yet.</p>}
      </div>
    </div>
  );
}

export default AdminAgents;