import { useState, useEffect, useCallback } from 'react';

function ImageLightbox({ images, title }) {
  const [openIndex, setOpenIndex] = useState(null); // null = closed

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  // Keyboard support — Esc to close, arrows to navigate
  useEffect(() => {
    if (openIndex === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden'; // stop background scroll while open

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, next, prev]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Thumbnail strip */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {images.map((img, i) => (
          <img
            key={img.publicId}
            src={img.url}
            alt={title}
            onClick={() => setOpenIndex(i)}
            style={{
              width: '100%',
              maxWidth: '760px',
              height: '400px',
              objectFit: 'cover',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Lightbox overlay */}
      {openIndex !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <button
            onClick={close}
            aria-label="Close"
            style={{
              position: 'absolute', top: '1.5rem', right: '2rem',
              background: 'none', border: 'none', color: 'white',
              fontSize: '2rem', cursor: 'pointer', lineHeight: 1,
            }}
          >
            &times;
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              style={{
                position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'white',
                fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1,
              }}
            >
              &#8249;
            </button>
          )}

          <img
            src={images[openIndex].url}
            alt={title}
            onClick={(e) => e.stopPropagation()} // clicking the image itself shouldn't close
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius)' }}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              style={{
                position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'white',
                fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1,
              }}
            >
              &#8250;
            </button>
          )}

          <div style={{ position: 'absolute', bottom: '1.5rem', color: 'white', fontSize: '0.9rem' }}>
            {openIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageLightbox;