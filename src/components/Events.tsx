import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Etkinlikler çekilemedi', err));
  }, []);

  return (
    <section
      id="etkinlikler"
      className="section-padding"
      style={{
        background: 'var(--color-bg-card)',
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
            <div className="editorial-eyebrow">Ajanda</div>
            <h2 className="editorial-title">GÜNDEM & ETKİNLİKLER</h2>
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
            Tümünü Gör <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex flex-col md:grid md:grid-cols-[100px_1fr_auto] gap-4 md:gap-6 items-start md:items-center p-5 md:p-6 bg-transparent hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-b-0"
              style={{
                borderTop: index === 0 ? '1px solid var(--color-border)' : 'none',
                cursor: 'default',
              }}
            >
              {/* Date box */}
              <div
                style={{
                  textAlign: 'center',
                  background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '0.75rem 0.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.8rem',
                    color: '#cc1616',
                    lineHeight: 1,
                  }}
                >
                  {new Date(event.eventDate).getDate()}
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.2rem',
                  }}
                >
                  {new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(new Date(event.eventDate))}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.4rem',
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '0.5rem',
                  }}
                >
                  {event.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    <MapPin size={10} color="#cc1616" />
                    {event.location}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    <Clock size={10} color="#cc1616" />
                    {new Date(event.eventDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/etkinlik/${event.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'color 0.2s',
                  padding: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#cc1616';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    'var(--color-text-muted)';
                }}
              >
                İncele <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
