import { useState, useEffect } from 'react';

const SLIDES = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
  'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=1600',
];

function HeroCarousel({ children }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ position: 'relative', height: '65vh', maxHeight: '620px', minHeight: '440px', overflow: 'hidden' }}>
      {SLIDES.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}

      {/* Light gradient at the bottom only — keeps the photo clear, just makes text readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
        }}
      />

      {/* Content sits on top */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'white',
        }}
      >
        {children}
      </div>

      {/* Slide indicator dots */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;