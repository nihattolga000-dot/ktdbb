import { Flag, BookOpen, Users, Mic } from 'lucide-react';

const activities = [
  {
    icon: Flag,
    title: 'Saha Çalışmaları ve Diplomatik Aksiyon',
    desc: 'Toplumun tüm kesimlerine ulaşarak milli refleksleri diri tutmak; anayasal haklar çerçevesinde kitleleri şuurlandıran ve kamuoyu oluşturan saha hareketleri organize etmek.',
  },
  {
    icon: BookOpen,
    title: 'Stratejik Analiz ve Doktrin',
    desc: 'Küresel gelişmelere ve jeopolitik kırılmalara "Türk aklıyla" yaklaşarak, ulusal çıkarlarımız doğrultusunda kapsamlı strateji raporları ve eylem planları kurgulamak.',
  },
  {
    icon: Users,
    title: 'Milli Özgüven ve Gençlik',
    desc: 'Dejenerasyona karşı bir kalkan oluşturarak, yeni nesilleri kendi tarihiyle barışık, yüksek özgüvenli, rasyonel ve karakterli bireyler olarak geleceğe hazırlamak.',
  },
  {
    icon: Mic,
    title: 'Kültürel ve Akademik Sempozyumlar',
    desc: 'Tarihimiz, Göktürk dil yapısı ve sosyokültürel dinamiklerimiz üzerine uzman akademisyenlerin katılımıyla gerçekleştirilen üst düzey panel ve konferanslar dizisi.',
  },
];

export default function Activities() {
  return (
    <section
      id="faaliyetler"
      className="section-padding"
      style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="editorial-eyebrow">Aksiyon</div>
          <h2 className="editorial-title">FAALİYET ODAKLARI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.title}
                style={{
                  background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'rgba(204,22,22,0.4)';
                  el.style.background = 'rgba(204,22,22,0.04)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.background = 'var(--color-bg-card)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: '2.5rem',
                    color: 'rgba(204,22,22,0.12)',
                    lineHeight: 1,
                  }}
                >
                  0{index + 1}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(204,22,22,0.12)',
                    border: '1px solid rgba(204,22,22,0.25)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={22} color="#cc1616" strokeWidth={1.8} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3,
                  }}
                >
                  {activity.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.75,
                  }}
                >
                  {activity.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
