import { ArrowUpRight } from 'lucide-react';
import { siteConfig, contactConfig, socialConfig } from '../data/config';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);


const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 5.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const footerLinks = {
  kurumsal: [
    { label: 'Hakkımızda', href: '#hakkimizda' },
    { label: 'Fikir Önderleri', href: '#fikir-onderleri' },
    { label: 'Yönetim Kadrosu', href: '#yonetim' },
  ],
  kesfet: [
    { label: 'Faaliyetler', href: '#faaliyetler' },
    { label: 'Projeler', href: '#projeler' },
    { label: 'Etkinlikler', href: '#etkinlikler' },
    { label: 'Haberler', href: '#haberler' },
    { label: 'Galeri', href: '#galeri' },
  ],
  iletisim: [
    { label: contactConfig.email, href: `mailto:${contactConfig.email}` },
    { label: contactConfig.phone, href: '#' },
    { label: contactConfig.address, href: '#' },
  ],
};

const socials = [
  { name: 'Instagram', Icon: InstagramIcon, href: socialConfig.instagram },
  { name: 'X', Icon: XIcon, href: socialConfig.twitter },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      style={{
        background: 'rgba(8,8,8,0.35)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      {/* Top red accent line */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #cc1616, rgba(204,22,22,0.3), transparent)',
        }}
      />

      <div className="container-custom" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="KTDB Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Kayseri TDB
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Turancı Dernekler Birliği
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.825rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Türk dünyasının ortak kültürel mirasını yaşatan ve geleceğe taşıyan sivil toplum kuruluşu.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {socials.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-border)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'rgba(204,22,22,0.2)';
                    el.style.borderColor = 'rgba(204,22,22,0.4)';
                    el.style.color = '#cc1616';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'var(--color-border)';
                    el.style.borderColor = 'var(--color-border)';
                    el.style.color = 'var(--color-text-muted)';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h4
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1.25rem',
              }}
            >
              Kurumsal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerLinks.kurumsal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#cc1616';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Keşfet */}
          <div>
            <h4
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1.25rem',
              }}
            >
              Keşfet
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerLinks.kesfet.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#cc1616';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1.25rem',
              }}
            >
              İletişim
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerLinks.iletisim.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'none',
                      lineHeight: 1.6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#cc1616';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)';
                    }}
                  >
                    {link.label}
                    {link.href.startsWith('mailto') && (
                      <ArrowUpRight size={12} style={{ flexShrink: 0 }} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1.25rem 0',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.775rem' }}>
            © 2026 {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#cc1616',
              }}
            />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
