import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../services/propertyService';
import HeroCarousel from '../components/HeroCarousel';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties({ featured: 'true', limit: 6 })
      .then((data) => setFeatured(data.properties))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
     <HeroCarousel>
  <h1 className="hero-title" style={{ fontSize: '2.6rem', maxWidth: '700px', margin: '0 auto 1rem', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
  Building homes, empowering families,<br />shaping the future
</h1>
<p className="hero-subtitle" style={{ marginBottom: '2rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
  Established in 2020 by a team of passionate property professionals.
</p>
  <HeroSearch />
</HeroCarousel>

      <section className="container section">
        <h2>Featured Properties</h2>
        {loading && <p className="text-muted">Loading...</p>}
        {!loading && featured.length > 0 && (
          <div className="grid mt-1">
            {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
        {!loading && featured.length === 0 && (
          <p className="text-muted">No featured properties right now — <Link to="/properties">browse all listings</Link>.</p>
        )}
      </section>
    </div>
  );
}

export default Home;