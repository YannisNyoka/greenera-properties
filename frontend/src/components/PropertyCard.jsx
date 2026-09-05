import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];

  return (
    <Link to={`/properties/${property.slug}`} className="card">
      <div className="card-image-wrap">
        {primaryImage ? (
          <img src={primaryImage.url} alt={property.title} className="card-image" />
        ) : (
          <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            No image
          </div>
        )}
        <span className="card-badge">{property.listingType === 'for-sale' ? 'For Sale' : 'To Let'}</span>
      </div>
      <div className="card-body">
        <h3>{property.title}</h3>
        <p className="card-price">R{property.price.toLocaleString()}</p>
        <p className="card-meta">{property.address.suburb}, {property.address.city}</p>
        <p className="card-meta">{property.bedrooms} bed &middot; {property.bathrooms} bath</p>
      </div>
    </Link>
  );
}

export default PropertyCard;