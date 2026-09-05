import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/propertyService';
import PropertyFilters from '../components/PropertyFilters';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';

function PropertyListings() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const filters = Object.fromEntries(searchParams);

    getProperties(filters)
      .then((data) => {
        setProperties(data.properties);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="container section">
      <h1>Properties for sale &amp; to let</h1>
      <PropertyFilters />

      {loading && <p className="text-muted">Loading properties...</p>}
      {error && <p className="text-error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>

          {properties.length === 0 && <p className="text-muted mt-1">No properties found matching your filters.</p>}
          {pagination && <Pagination pagination={pagination} />}
        </>
      )}
    </div>
  );
}

export default PropertyListings;