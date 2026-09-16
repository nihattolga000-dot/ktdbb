import { ArrowRight, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Projeler çekilemedi', err));
  }, []);

  const getStatusText = (status: string) => {
    if (status === 'ONGOING') return 'DEVAM EDEN PROJE';
    if (status === 'COMPLETED') return 'TAMAMLANAN PROJE';
    return 'PLANLANAN PROJE';
  };

  return (
    <section
      id="projeler"
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
            <div className="editorial-eyebrow">Çalışmalarımız</div>
            <h2 className="editorial-title">PROJELERİMİZ</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: '280px' }}>
            Türk dünyasına yönelik yürüttüğümüz somut projeler ve girişimler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <article
              key={project.id}
              style={{
                background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(204,22,22,0.35)';
                el.style.transform = 'translateY(-6px)';
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
                  src={project.imageUrl || 'https://via.placeholder.com/800x600?text=Kayseri+TDB+Proje'}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    filter: 'brightness(0.8)',
                  }}
                  loading="lazy"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, color-mix(in srgb, var(--color-bg-primary) 70%, transparent) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem' }}>
                {/* Category badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.3rem 0.75rem',
                    background: 'rgba(204,22,22,0.12)',
                    border: '1px solid rgba(204,22,22,0.25)',
                    borderRadius: '3px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#cc1616',
                    textTransform: 'uppercase',
                    marginBottom: '0.875rem',
                  }}
                >
                  <Tag size={9} />
                  {getStatusText(project.status)}
                </div>

                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    lineHeight: 1.3,
                    marginBottom: '0.6rem',
                  }}
                >
                  {project.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                  }}
                >
                  {project.description}
                </p>

                <Link
                  to={`/proje/${project.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
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
                  Projeyi İncele
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
