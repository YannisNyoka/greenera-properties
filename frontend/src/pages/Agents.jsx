import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgents } from '../services/agentService';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents()
      .then((data) => setAgents(data.agents))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container section"><p className="text-muted">Loading agents...</p></div>;

  return (
    <div className="container section">
      <h1>Meet Our Agents</h1>
      <div className="grid mt-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {agents.map((a) => (
          <Link key={a._id} to={`/agents/${a._id}`} style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            {a.photo?.url ? (
              <img
                src={a.photo.url}
                alt={a.name}
                style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }}
              />
            ) : (
              <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--color-bg-alt)', margin: '0 auto' }} />
            )}
            <h3 className="mt-1">{a.name}</h3>
            {a.title && <p className="text-muted">{a.title}</p>}
          </Link>
        ))}
      </div>
      {agents.length === 0 && <p className="text-muted">No agents to display.</p>}
    </div>
  );
}

export default Agents;