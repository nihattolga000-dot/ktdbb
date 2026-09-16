import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function News() {
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/news')
      .then(res => res.json())
      .then(data => setNewsItems(data))
      .catch(err => console.error('Haberler çekilemedi', err));
  }, []);

  return (
    <section
      id="haberler"
      className="section-padding bg-bozkurt-pattern"
      style={{
        background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div className="editorial-eyebrow">Gündem</div>
            <h2 className="editorial-title">SON HABERLER</h2>
          </div>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#cc1616',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'gap 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.gap = '0.7rem';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.gap = '0.4rem';
            }}
          >
            Tüm Haberler <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              style={{
                background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                ...(index === 0
                  ? { gridColumn: 'span 1' }
                  : {}),
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(204,22,22,0.35)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--color-border)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '16/9',
                }}
              >
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/800x600?text=Kayseri+TDB'}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    filter: 'brightness(0.75)',
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform =
                      'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                  }}
                />
                {/* Category overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.3rem 0.65rem',
                    background: '#cc1616',
                    borderRadius: '3px',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                  }}
                >
                  <Tag size={8} />
                  GÜNDEM
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Calendar size={11} color="var(--color-text-muted)" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    lineHeight: 1.35,
                    marginBottom: '0.6rem',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                  }}
                >
                  {item.content?.substring(0, 100)}{item.content?.length > 100 ? '...' : ''}
                </p>

                <Link
                  to={`/haber/${item.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#cc1616',
                    textDecoration: 'none',
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.gap = '0.7rem';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.gap = '0.4rem';
                  }}
                >
                  Devamını Oku
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
