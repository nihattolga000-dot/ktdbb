import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, Eye } from 'lucide-react';

interface GalleryProps {
  isStandalone?: boolean;
}

export default function Gallery({ isStandalone = false }: GalleryProps) {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<null | { src: string; alt: string; caption: string }>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => setGalleryItems(data))
      .catch(err => console.error('Galeri çekilemedi', err));
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <section
      id="galeri"
      className={isStandalone ? '' : 'section-padding'}
      style={{
        background: isStandalone ? 'transparent' : 'var(--color-bg-card)',
        borderBottom: isStandalone ? 'none' : '1px solid var(--color-border)',
      }}
    >
      <div className="container-custom">
        {!isStandalone && (
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <div className="editorial-eyebrow">Fotoğraflar</div>
            <h2 className="editorial-title">GÖRSEL HAFIZA</h2>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="masonry-item group"
              onClick={() => setLightbox({ src: item.imageUrl, alt: item.title || '', caption: item.title || '' })}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'color-mix(in srgb, var(--color-bg-primary) 50%, transparent)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  opacity: loadedImages.has(item.id) ? 1 : 0.5,
                  transform: loadedImages.has(item.id) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || ''}
                  onLoad={() => handleImageLoad(item.id)}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s',
                    filter: 'brightness(0.9) contrast(1.05)',
                  }}
                  loading="lazy"
                />

                {/* Cinematic Hover Overlay */}
                <div
                  className="gallery-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.2) 50%, transparent 100%)',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem 1.5rem',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <div
                    className="overlay-content"
                    style={{
                      transform: 'translateY(20px)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(204,22,22,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(204,22,22,0.5)'
                      }}>
                        <Eye size={16} color="#fff" />
                      </div>
                      <span style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        Görüntüle
                      </span>
                    </div>
                    {item.title && (
                      <h3 style={{
                        color: '#fff',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                      }}>
                        {item.title}
                      </h3>
                    )}
                  </div>
                </div>

                {/* Global CSS for interactions */}
                <style>{`
                  .masonry-item:hover img {
                    transform: scale(1.05);
                    filter: brightness(1) contrast(1.1);
                  }
                  .masonry-item:hover .gallery-overlay {
                    opacity: 1;
                  }
                  .masonry-item:hover .overlay-content {
                    transform: translateY(0);
                  }
                `}</style>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Lightbox */}
      {lightbox && createPortal(
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(10,10,10,0.95)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(204,22,22,0.8)';
              e.currentTarget.style.borderColor = 'rgba(204,22,22,1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Kapat"
          >
            <X size={24} />
          </button>
          
          <div
            style={{ 
              maxWidth: '1200px', 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
              />
            </div>
            
            {lightbox.caption && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <p
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    margin: 0,
                    fontWeight: 500
                  }}
                >
                  {lightbox.caption}
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 640px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        
        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 3;
          }
        }
      `}</style>
    </section>
  );
}
