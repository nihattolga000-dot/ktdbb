import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const RED = '#cc1616';

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    label: 'Kurumsal',
    children: [
      { label: 'Hakkımızda', href: '#hakkimizda' },
      { label: 'Yönetim Kadrosu', href: '#yonetim' },
    ],
  },
  {
    label: 'Faaliyetler',
    children: [
      { label: 'Faaliyet Odakları', href: '#faaliyetler' },
      { label: 'Projeler', href: '#projeler' },
      { label: 'Etkinlikler', href: '#etkinlikler' },
    ],
  },
  {
    label: 'Medya',
    children: [
      { label: 'Haberler', href: '#haberler' },
      { label: 'Galeri', href: '/galeri' },
      { label: 'Sosyal Medya', href: '#sosyal-medya' },
    ],
  },
  { label: 'İletişim', href: '#iletisim' },
];

function DropdownMenu({
  items,
  open,
  onNavigate,
}: {
  items: { label: string; href: string }[];
  open: boolean;
  onNavigate: (href: string) => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: open ? 'translate(-50%, 0)' : 'translate(-50%, -8px)',
        paddingTop: '8px',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        zIndex: 100,
      }}
    >
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderTop: `2px solid ${RED}`,
        minWidth: '200px',
        borderRadius: '0 0 6px 6px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px color-mix(in srgb, var(--color-bg-primary) 50%, transparent)',
      }}>
      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => onNavigate(item.href)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '0.75rem 1.25rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'color 0.2s, background 0.2s',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-red-glow)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          {item.label}
        </button>
      ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled
            ? 'color-mix(in srgb, var(--color-bg-primary) 97%, transparent)'
            : 'color-mix(in srgb, var(--color-bg-primary) 85%, transparent)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container-custom">
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '80px',
            }}
          >
            {/* Logo */}
            <button
              onClick={() => scrollTo('#hero')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
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
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
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
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  Turancı Dernekler Birliği
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <ul
              style={{
                alignItems: 'center',
                gap: '0.25rem',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
              className="hidden lg:flex"
            >
              {navItems.map((item) => (
                <li
                  key={item.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() =>
                    item.children && setOpenDropdown(item.label)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.href ? (
                    <button
                      onClick={() => scrollTo(item.href!)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color:
                          openDropdown === item.label
                            ? 'var(--color-text-primary)'
                            : 'var(--color-text-secondary)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        borderRadius: '4px',
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color:
                          openDropdown === item.label
                            ? 'var(--color-red)'
                            : 'var(--color-text-primary)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        borderRadius: '4px',
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        style={{
                          transition: 'transform 0.2s',
                          transform:
                            openDropdown === item.label
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                        }}
                      />
                    </button>
                  )}
                  {item.children && (
                    <DropdownMenu
                      items={item.children}
                      open={openDropdown === item.label}
                      onNavigate={scrollTo}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '1rem' }}>
              
              <button
                onClick={toggleTheme}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Temayı Değiştir"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => window.location.href = '/login'}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  padding: '0.55rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                GİRİŞ
              </button>

              <button
                onClick={() => scrollTo('#katil')}
                style={{
                  background: RED,
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  padding: '0.55rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#a81010';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = RED;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Bize Katıl
              </button>
            </div>

              <button
                onClick={toggleTheme}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  padding: '0.4rem',
                  alignItems: 'center',
                  marginRight: '0.5rem'
                }}
                className="flex lg:hidden"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                  padding: '0.4rem',
                alignItems: 'center',
              }}
              className="flex lg:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Completely outside header to avoid stacking/backdrop bugs */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'color-mix(in srgb, var(--color-bg-primary) 98%, transparent)',
          backdropFilter: 'blur(25px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-15px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          zIndex: 48,
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              style={{
                marginBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
                transform: mobileOpen ? 'translateY(0)' : 'translateY(15px)',
                opacity: mobileOpen ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${idx * 0.08}s`
              }}
            >
              {item.href ? (
                <button
                  onClick={() => scrollTo(item.href!)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '1.2rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-red)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                >
                  {item.label}
                </button>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.label ? null : item.label
                      )
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '1.2rem 0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: mobileExpanded === item.label ? 'var(--color-red)' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.6rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={24}
                      style={{
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform:
                          mobileExpanded === item.label
                            ? 'rotate(180deg)'
                            : 'rotate(0)',
                      }}
                    />
                  </button>
                  {mobileExpanded === item.label && item.children && (
                    <div style={{ padding: '0 0 1rem 1rem' }}>
                      <div style={{ borderLeft: '2px solid var(--color-red-glow)', paddingLeft: '1rem' }}>
                        {item.children.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => scrollTo(child.href)}
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.8rem 0',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--color-text-secondary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '1.1rem',
                              fontWeight: 500,
                              letterSpacing: '0.05em',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
            <button
              onClick={() => scrollTo('#katil')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '1.2rem',
                background: 'var(--color-red)',
                color: 'var(--color-text-primary)',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 10px 30px -10px rgba(204,22,22,0.6)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-red-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-red)')}
            >
              Bize Katıl
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
          .lg-hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
