import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  isStandalone?: boolean;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
}

interface GalleryItem {
  id: string;
  title: string | null;
  imageUrl: string;
  date: string;
  images: GalleryImage[];
}

export default function Gallery({ isStandalone = false }: GalleryProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lightboxAlbum, setLightboxAlbum] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGalleryItems(data))
      .catch(err => console.error('Galeri çekilemedi', err));
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const openLightbox = (item: GalleryItem) => {
    setLightboxAlbum(item);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxAlbum && lightboxAlbum.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % lightboxAlbum.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxAlbum && lightboxAlbum.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + lightboxAlbum.images.length) % lightboxAlbum.images.length);
    }
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
              onClick={() => openLightbox(item)}
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

                <div
                  style={{
                    padding: '1.25rem 1rem',
                    background: 'var(--color-bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    borderTop: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.title && (
                      <h3 style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                        margin: 0
                      }}>
                        {item.title}
                      </h3>
                    )}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(204,22,22,0.1)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      color: 'var(--color-red)'
                    }}>
                      <ImageIcon size={14} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.images?.length || 0}</span>
                    </div>
                  </div>
                  {item.date && (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Global CSS for interactions */}
                <style>{`
                  .masonry-item:hover img {
                    transform: scale(1.05);
                    filter: brightness(1) contrast(1.1);
                  }
                `}</style>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Lightbox */}
      {lightboxAlbum && createPortal(
        <div
          onClick={() => setLightboxAlbum(null)}
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
          {/* Close Button */}
          <button
            onClick={() => setLightboxAlbum(null)}
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
          
          {/* Previous Button */}
          {lightboxAlbum.images && lightboxAlbum.images.length > 1 && (
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {lightboxAlbum.images && lightboxAlbum.images.length > 1 && (
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div
            style={{ 
              maxWidth: '1200px', 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              paddingBottom: '80px' // Leave space for the info bar
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src={lightboxAlbum.images && lightboxAlbum.images.length > 0 ? lightboxAlbum.images[currentImageIndex].imageUrl : lightboxAlbum.imageUrl}
                alt={lightboxAlbum.title || 'Albüm görseli'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
              />
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '1rem 3rem',
              background: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              zIndex: 20,
              minWidth: '300px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <h4 style={{
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: 0,
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                {lightboxAlbum.title || 'Albüm Detayı'}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {lightboxAlbum.date ? new Date(lightboxAlbum.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
                {lightboxAlbum.images && lightboxAlbum.images.length > 0 && (
                  <span style={{ 
                    color: '#fff', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    background: 'rgba(204,22,22,0.8)', 
                    padding: '4px 12px', 
                    borderRadius: '20px',
                    boxShadow: '0 2px 10px rgba(204,22,22,0.4)'
                  }}>
                    {currentImageIndex + 1} / {lightboxAlbum.images.length}
                  </span>
                )}
              </div>
            </div>
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
