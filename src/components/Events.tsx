import { MapPin, Clock, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../data/config';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
          const now = new Date();
          const upcoming = data.filter((e: any) => new Date(e.eventDate) >= now);
          // Yaklaşan etkinlik yoksa ama geçmiş etkinlik varsa otomatik geçmiş sekmesine geç
          if (upcoming.length === 0 && data.length > 0) {
            setActiveTab('past');
          }
        }
      })
      .catch(err => console.error('Etkinlikler çekilemedi', err));
  }, []);

  const now = new Date();
  const upcomingEvents = events
    .filter(e => new Date(e.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pastEvents = events
    .filter(e => new Date(e.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  const currentList = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

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
        {/* HEADER AREA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <div className="editorial-eyebrow">Ajanda & Takvim</div>
            <h2 className="editorial-title">ETKİNLİKLER</h2>
          </div>

          {/* TABS (Yaklaşan / Geçmiş) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-['Oswald'] transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                activeTab === 'upcoming'
                  ? 'bg-[#cc1616] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>Yaklaşan</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                  activeTab === 'upcoming' ? 'bg-black/25 text-white' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {upcomingEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-['Oswald'] transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                activeTab === 'past'
                  ? 'bg-[#cc1616] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>Geçmiş</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                  activeTab === 'past' ? 'bg-black/25 text-white' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {pastEvents.length}
              </span>
            </button>
          </div>
        </div>

        {/* LIST AREA */}
        {currentList.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 my-6">
            <Calendar size={44} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-40" />
            <h3 className="font-['Oswald'] text-lg uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
              {activeTab === 'upcoming' ? 'Yaklaşan Etkinlik Bulunmuyor' : 'Geçmiş Etkinlik Bulunmuyor'}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm max-w-md mx-auto">
              {activeTab === 'upcoming'
                ? 'Şu anda planlanmış yeni bir etkinlik bulunmamaktadır. Yeni duyurularımız için bizi takip etmeye devam edin.'
                : 'Sistemde henüz geçmişe ait etkinlik kaydı yer almıyor.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {currentList.map((event, index) => {
              const evDate = new Date(event.eventDate);
              const isPast = activeTab === 'past';

              return (
                <div
                  key={event.id}
                  className="flex flex-col md:grid md:grid-cols-[100px_1fr_auto] gap-4 md:gap-6 items-start md:items-center p-5 md:p-6 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 border-b border-[var(--color-border)] last:border-b-0"
                  style={{
                    borderTop: index === 0 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'default',
                  }}
                >
                  {/* Date box */}
                  <div
                    style={{
                      textAlign: 'center',
                      background: 'color-mix(in srgb, var(--color-bg-card) 60%, transparent)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '0.75rem 0.5rem',
                      minWidth: '85px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.8rem',
                        color: isPast ? 'var(--color-text-muted)' : '#cc1616',
                        lineHeight: 1,
                      }}
                    >
                      {evDate.getDate()}
                    </div>
                    <div
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(evDate)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {isPast ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Oswald'] bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                          <CheckCircle2 size={11} />
                          Geçmiş Etkinlik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Oswald'] bg-[#cc1616]/10 text-[#cc1616] border border-[#cc1616]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#cc1616] animate-pulse" />
                          Yaklaşan
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: 'var(--color-text-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '0.35rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {event.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '0.6rem',
                      }}
                      className="line-clamp-2"
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
                      {event.location && (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.72rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          <MapPin size={11} color="#cc1616" />
                          {event.location}
                        </span>
                      )}
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.72rem',
                          color: 'var(--color-text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        <Clock size={11} color="#cc1616" />
                        {evDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/etkinlik/${event.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isPast ? 'var(--color-text-secondary)' : '#cc1616',
                      textDecoration: 'none',
                      background: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      padding: '0.6rem 1rem',
                    }}
                    className="hover:border-[#cc1616] hover:text-[#cc1616] active:scale-95"
                  >
                    {isPast ? 'Detaylar' : 'Katıl & İncele'} <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
