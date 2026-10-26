import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryViewerProps {
  images: string[];
  title?: string;
  aspectRatio?: string;
  fallbackIcon?: ReactNode;
}

export default function ImageGalleryViewer({
  images,
  title = '',
  aspectRatio = '16/10',
  fallbackIcon,
}: ImageGalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Klavye ok tuşları ve ESC ile lightbox kontrolü
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div
        className="relative w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-md transition-colors duration-300"
        style={{ aspectRatio }}
      >
        {/* Dekoratif hafif desen */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cc1616]/5 via-transparent to-[#cc1616]/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#cc1616]/10 border border-[#cc1616]/20 flex items-center justify-center text-[#cc1616] shadow-sm">
            {fallbackIcon || <ImageIcon size={32} />}
          </div>
          <div>
            <p className="font-['Oswald'] text-sm uppercase tracking-widest text-[var(--color-text-primary)] font-bold">
              Kayseri TDB Arşivi
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Bu içerik için görsel eklenmemiştir
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* ANA GÖRSEL KARTI */}
      <div className="relative group rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-lg backdrop-blur-sm transition-all duration-300">
        {/* Görsel Arka Işıltısı */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#cc1616]/15 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div
          className="relative w-full cursor-pointer overflow-hidden flex items-center justify-center bg-black/5"
          style={{ aspectRatio }}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={`${title} - Görsel ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Alt hafif degrade - yazılar ve ikonlar için */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Büyütme (Fullscreen) Rozeti */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-3 right-3 p-2.5 rounded-xl bg-black/60 hover:bg-[#cc1616] text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all opacity-85 group-hover:opacity-100 shadow-lg active:scale-95"
            title="Tam Ekran Görüntüle"
          >
            <Maximize2 size={16} />
          </button>

          {/* Sayfa / Adet Sayacı */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white/90 tracking-wider">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Önceki / Sonraki Butonları (1'den fazla görsel varsa) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#cc1616] text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-xl active:scale-95"
                aria-label="Önceki Görsel"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#cc1616] text-white border border-white/10 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-xl active:scale-95"
                aria-label="Sonraki Görsel"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* KÜÇÜK RESİM ŞERİDİ (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 px-0.5 no-scrollbar scroll-smooth">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'border-[#cc1616] scale-100 ring-2 ring-[#cc1616]/40 shadow-lg'
                    : 'border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-[var(--color-border-light)]'
                }`}
              >
                <img
                  src={img}
                  alt={`Küçük Resim ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-[#cc1616]/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Kapat Butonu */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-20 p-3 rounded-full bg-white/10 hover:bg-[#cc1616] text-white border border-white/15 transition-all hover:scale-105"
            title="Kapat (ESC)"
          >
            <X size={22} />
          </button>

          {/* Üst Bilgi */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white tracking-widest uppercase">
              {activeIndex + 1} / {images.length}
            </span>
            {title && (
              <span className="text-white/70 text-sm hidden sm:inline max-w-md truncate">
                {title}
              </span>
            )}
          </div>

          {/* Büyük Görsel */}
          <div
            className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={title}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
            />
          </div>

          {/* Lightbox Navigasyon */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#cc1616] text-white border border-white/20 transition-all hover:scale-110"
                aria-label="Önceki"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#cc1616] text-white border border-white/20 transition-all hover:scale-110"
                aria-label="Sonraki"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
