import { socialConfig } from '../data/config';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 5.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socials = [
  {
    name: 'Instagram',
    handle: '@tdb.kayserii',
    Icon: InstagramIcon,
    href: socialConfig.instagram,
  },
  {
    name: 'X (Twitter)',
    handle: '@tdbkayseri',
    Icon: XIcon,
    href: socialConfig.twitter,
  },
];

export default function SocialMedia() {
  return (
    <section
      id="sosyal-medya"
      style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '5rem 0',
      }}
    >
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            className="editorial-eyebrow"
            style={{ justifyContent: 'center', marginBottom: '0.75rem' }}
          >
            Sosyal Medya
          </div>
          <h2 className="editorial-title">BİZİ TAKİP EDİN</h2>
          <p
            style={{
              marginTop: '0.75rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem',
            }}
          >
            Güncel haberler ve etkinlikler için sosyal medya hesaplarımızı takip edin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {socials.map(({ name, handle, Icon, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '2rem 1.5rem',
                background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(204,22,22,0.07)';
                el.style.borderColor = 'rgba(204,22,22,0.35)';
                el.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--color-bg-card)';
                el.style.borderColor = 'var(--color-border)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'rgba(204,22,22,0.12)',
                  border: '1px solid rgba(204,22,22,0.25)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#cc1616',
                }}
              >
                <Icon />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.2rem',
                  }}
                >
                  {handle}
                </div>
              </div>


            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
