import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EnquiryForm from '../components/EnquiryForm';
import { getPropertyBySlug, getSimilarProperties } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import BondCalculator from '../components/BondCalculator';
import PropertyMap from '../components/PropertyMap';
import ImageLightbox from '../components/ImageLightbox';

function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similar, setSimilar] = useState([]);

 useEffect(() => {
  getPropertyBySlug(slug)
    .then((data) => {
      setProperty(data.property);
      return getSimilarProperties(slug);
    })
    .then((data) => setSimilar(data.properties))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, [slug]);

  if (loading) return <div className="container section"><p className="text-muted">Loading...</p></div>;
  if (error) return <div className="container section"><p className="text-error">Error: {error}</p></div>;
  if (!property) return null;

  return (
    <div className="container section" style={{ maxWidth: '800px' }}>
      <ImageLightbox images={property.images} title={property.title} />

      <h1>{property.title}</h1>
      <p className="card-price" style={{ fontSize: '1.5rem' }}>R{property.price.toLocaleString()}</p>
      <p className="text-muted">
        {property.address.street}, {property.address.suburb}, {property.address.city}, {property.address.province}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
        <span>{property.bedrooms} bed</span>
        <span>{property.bathrooms} bath</span>
        <span>{property.parkingSpaces} parking</span>
        <span>{property.floorSize} m&sup2;</span>
      </div>

      {property.location?.coordinates && (
  <div className="mt-1 mb-1">
    <PropertyMap coordinates={property.location.coordinates} title={property.title} />
  </div>
)}

      <p>{property.description}</p>
      <div className="mt-2">
  <BondCalculator propertyPrice={property.price} />
</div>

      <hr className="mt-2" style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      <h3 className="mt-2">Listed by</h3>
      <p>{property.agent?.name}</p>
      <p className="text-muted">{property.agent?.email} &middot; {property.agent?.phone}</p>

      <hr className="mt-2" style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      <h3 className="mt-2">Enquire about this property</h3>
      <EnquiryForm propertyId={property._id} source="property-page" />

      {similar.length > 0 && (
  <>
    <hr className="mt-2" style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
    <h3 className="mt-2">Similar Properties</h3>
    <div className="grid mt-1">
      {similar.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  </>
)}
    </div>
  );
}

export default PropertyDetail;