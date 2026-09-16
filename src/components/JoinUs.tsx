import { ArrowRight, Mail, Shield, Star, Globe, Zap } from 'lucide-react';

const benefits = [
  { icon: Shield, text: 'Etkinlik ve sempozyumlara öncelikli erişim' },
  { icon: Star, text: 'Yönetim kararlarında oy hakkı' },
  { icon: Globe, text: 'Türk dünyası ağına dahil olma' },
  { icon: Zap, text: 'Özel eğitim ve atölye programları' },
];

export default function JoinUs() {
  return (
    <section className="bg-bozkurt-pattern"
      id="katil"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Top red border accent */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #cc1616, transparent)',
        }}
      />

      <div
        className="container-custom"
        style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
      >
        {/* BG decorative */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            transform: 'translateY(-50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(204,22,22,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Text */}
          <div>
            <div className="editorial-eyebrow">Bize Katılın</div>
            <h2 className="editorial-title" style={{ marginBottom: '1rem' }}>
              BU YOLCULUĞUN BİR PARÇASI OLUN
            </h2>
            <div
              style={{
                width: '48px',
                height: '3px',
                background: '#cc1616',
                borderRadius: '2px',
                marginBottom: '1.25rem',
              }}
            />
            <p
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                fontSize: '1rem',
                marginBottom: '2rem',
              }}
            >
              Türk dünyasına yönelik kültürel ve sosyal çalışmalarımıza katkı
              sunmak için bizimle iletişime geçin. Gönüllülük, iş birliği ve
              dayanışmayla birlikte büyüyoruz.
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <a
                href="#iletisim"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#iletisim')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.75rem',
                  background: '#cc1616',
                  color: 'var(--color-text-primary)',
                  border: '2px solid #cc1616',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = '#a81010';
                  el.style.borderColor = '#a81010';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = '#cc1616';
                  el.style.borderColor = '#cc1616';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <ArrowRight size={15} />
                Bize Katıl
              </a>
              <a
                href="#iletisim"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#iletisim')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.75rem',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '2px solid var(--color-text-muted)',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--color-text-muted)';
                  el.style.background = 'var(--color-text-muted)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--color-text-muted)';
                  el.style.background = 'transparent';
                }}
              >
                <Mail size={15} />
                İletişime Geç
              </a>
            </div>
          </div>

          {/* Right: Benefits */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '2rem',
              borderTop: '3px solid #cc1616',
            }}
          >
            <h3
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1.5rem',
              }}
            >
              Üyelik Avantajları
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {benefits.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.875rem',
                    background: 'rgba(204,22,22,0.04)',
                    border: '1px solid rgba(204,22,22,0.12)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      background: 'var(--color-red-glow)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color="#cc1616" strokeWidth={1.8} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
