import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Gallery from '../components/Gallery';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {/* Cinematic Header */}
        <div style={{
          position: 'relative',
          padding: '160px 0 80px',
          background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-bg-secondary) 50%, transparent), var(--color-bg-primary))',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          {/* Subtle background icon/pattern */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.02,
            pointerEvents: 'none',
            color: 'var(--color-text-primary)'
          }}>
            <ImageIcon size={400} strokeWidth={1} />
          </div>

          <div className="container-custom relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Link 
              to="/" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--color-text-muted)",
                fontSize: 12,
                textDecoration: "none",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                transition: "all 0.3s ease",
                marginBottom: '2.5rem',
                border: '1px solid var(--color-border)',
                padding: '0.6rem 1.2rem',
                borderRadius: '30px',
                background: 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowLeft size={14} /> Ana Sayfaya Dön
            </Link>

            <div className="editorial-eyebrow">Görsel Hafıza</div>
            <h1 className="editorial-title" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1.5rem' }}>
              FOTOĞRAF <span style={{ color: 'var(--color-red)' }}>GALERİSİ</span>
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.1rem',
              maxWidth: '650px',
              lineHeight: 1.8
            }}>
              Kayseri Turancı Dernekler Birliği'nin geçmişten bugüne gerçekleştirdiği faaliyetler, etkinlikler ve unutulmaz anlardan derlenen görsel arşivimiz.
            </p>
          </div>
        </div>

        <div style={{ padding: '4rem 0 8rem' }}>
          <Gallery isStandalone />
        </div>
      </main>

      <Footer />
    </div>
  );
}
