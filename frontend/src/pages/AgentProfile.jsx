import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAgentById } from '../services/agentService';
import { getProperties } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';

function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAgentById(id),
      getProperties({ agent: id }),
    ])
      .then(([agentData, propData]) => {
        setAgent(agentData.agent);
        setProperties(propData.properties);
      })
      .catch((err) => setError(err.response?.data?.message || 'Agent not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><p className="text-muted">Loading...</p></div>;
  if (error) return <div className="container section"><p className="text-error">{error}</p></div>;
  if (!agent) return null;

  return (
    <div className="container section">
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {agent.photo?.url ? (
          <img
            src={agent.photo.url}
            alt={agent.name}
            style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'var(--color-bg-alt)' }} />
        )}
        <div>
          <h1>{agent.name}</h1>
          {agent.title && <p className="text-muted">{agent.title}</p>}
          <p>{agent.email} &middot; {agent.phone}</p>
        </div>
      </div>

      {agent.bio && <p className="mt-2" style={{ maxWidth: '700px' }}>{agent.bio}</p>}

      <h2 className="mt-2">Listings by {agent.name}</h2>
      <div className="grid mt-1">
        {properties.map((p) => (
          <PropertyCard key={p._id} property={p} />
        ))}
      </div>
      {properties.length === 0 && <p className="text-muted">No active listings from this agent right now.</p>}
    </div>
  );
}

export default AgentProfile;