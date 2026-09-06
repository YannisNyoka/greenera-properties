import { useState } from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const images = property.images && property.images.length > 0 ? property.images : [];
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const goTo = (e, i) => {
    e.preventDefault(); // stop the Link navigating
    e.stopPropagation();
    setIndex(i);
  };

  const next = (e) => goTo(e, (index + 1) % images.length);
  const prev = (e) => goTo(e, (index - 1 + images.length) % images.length);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) {
      // swipe left -> next, swipe right -> previous
      deltaX < 0 ? next(e) : prev(e);
    }
    setTouchStartX(null);
  };

  return (
    <Link to={`/properties/${property.slug}`} className="card">
      <div
        className="card-image-wrap"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <img src={images[index].url} alt={property.title} className="card-image" />
        ) : (
          <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            No image
          </div>
        )}

        <span className="card-badge">{property.listingType === 'for-sale' ? 'For Sale' : 'To Let'}</span>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              style={{
                position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.45)', border: 'none', color: 'white',
                width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', lineHeight: 1,
              }}
            >
              &#8249;
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              style={{
                position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.45)', border: 'none', color: 'white',
                width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', lineHeight: 1,
              }}
            >
              &#8250;
            </button>

            <div style={{ position: 'absolute', bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.3rem' }}>
              {images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i === index ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          </>
        )}
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