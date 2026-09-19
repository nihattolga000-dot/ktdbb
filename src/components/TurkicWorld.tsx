import { Globe, Landmark } from 'lucide-react';

const mapPoints = [
  { label: 'İstanbul', x: 25, y: 40 },
  { label: 'Ankara', x: 30, y: 42 },
  { label: 'Bakü', x: 42, y: 41 },
  { label: 'Taşkent', x: 65, y: 43 },
  { label: 'Almatı', x: 72, y: 38 },
  { label: 'Aşkabat', x: 55, y: 48 },
  { label: 'Bişkek', x: 70, y: 41 },
  { label: 'Nur-Sultan', x: 68, y: 28 },
  { label: 'Kazan', x: 50, y: 22 },
];

export default function TurkicWorld() {
  return (
    <section
      id="turk-dunyasi"
      className="section-padding"
      style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text & Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div className="editorial-eyebrow">Kurumsal Değerlerimiz</div>
              <h2 className="editorial-title" style={{ marginBottom: '1.25rem' }}>
                VİZYON VE <span style={{ color: '#cc1616' }}>MİSYON</span>
              </h2>
              <div
                style={{
                  width: '48px',
                  height: '3px',
                  background: '#cc1616',
                  borderRadius: '2px',
                  marginBottom: '1.5rem',
                }}
              />
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  fontSize: '1rem',
                  fontWeight: 400,
                }}
              >
                Kayseri Turancı Dernekler Birliği olarak, geçmişimizden aldığımız güçle
                geleceği inşa etme yolunda emin adımlarla ilerliyoruz.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Vizyon Card */}
              <div
                className="group"
                style={{
                  background: 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(204,22,22,0.4)';
                  (e.currentTarget as HTMLDivElement).style.background = 'color-mix(in srgb, var(--color-red-glow) 20%, transparent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.background = 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '4px', height: '100%',
                    background: '#cc1616',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px'
                  }}
                />
                <div
                  style={{
                    width: '48px', height: '48px', flexShrink: 0,
                    background: 'rgba(204,22,22,0.1)',
                    border: '1px solid rgba(204,22,22,0.2)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Globe size={24} color="#cc1616" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '1.2rem',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Vizyonumuz
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Orta Asya'dan Balkanlara, Kafkasya'dan Sibirya'ya uzanan Türk dünyası coğrafyasında kültürel bağları güçlendirmek. Ortak tarih ve ülkü etrafında sarsılmaz bir köprü kurarak, dilde, fikirde ve işte birliği sağlamış, güçlü ve bağımsız bir Türk Dünyası inşa etmek.
                  </p>
                </div>
              </div>

              {/* Misyon Card */}
              <div
                className="group"
                style={{
                  background: 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(204,22,22,0.4)';
                  (e.currentTarget as HTMLDivElement).style.background = 'color-mix(in srgb, var(--color-red-glow) 20%, transparent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.background = 'color-mix(in srgb, var(--color-bg-card) 50%, transparent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '4px', height: '100%',
                    background: '#cc1616',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px'
                  }}
                />
                <div
                  style={{
                    width: '48px', height: '48px', flexShrink: 0,
                    background: 'rgba(204,22,22,0.1)',
                    border: '1px solid rgba(204,22,22,0.2)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Landmark size={24} color="#cc1616" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '1.2rem',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Misyonumuz
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Binlerce yıllık tarihsel mirasımızı modern dünyanın dinamikleriyle harmanlayarak milli şuurla donatılmış yeni nesiller yetiştirmek. Eğitimden diplomasiye, stratejik planlamadan kültürel entegrasyona kadar her alanda rasyonel ve bilimsel adımlar atarak Türk milletinin menfaatlerini savunmak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-tech Map SVG */}
          <div
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-bg-primary) 60%, transparent) 0%, color-mix(in srgb, var(--color-bg-primary) 80%, transparent) 100%)',
              border: '1px solid var(--color-border)',
              boxShadow: 'inset 0 0 40px color-mix(in srgb, var(--color-bg-primary) 50%, transparent)',
            }}
          >
            {/* Grid overlay for high-tech look */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <svg viewBox="0 0 100 80" className="w-full h-full relative z-10 p-4">
              {/* Radar sweeps or decorative elements */}
              <circle cx="50" cy="40" r="35" fill="none" stroke="rgba(204,22,22,0.05)" strokeWidth="0.5" strokeDasharray="1 3" />
              <circle cx="50" cy="40" r="25" fill="none" stroke="rgba(204,22,22,0.08)" strokeWidth="0.5" strokeDasharray="2 4" />

              {/* Connection lines */}
              {mapPoints.slice(1).map((point, i) => (
                <line
                  key={i}
                  x1={mapPoints[0].x}
                  y1={mapPoints[0].y}
                  x2={point.x}
                  y2={point.y}
                  stroke="#cc1616"
                  strokeWidth="0.15"
                  strokeDasharray="0.8 1.2"
                  opacity="0.4"
                />
              ))}

              {/* Central hub connections */}
              <line x1={mapPoints[2].x} y1={mapPoints[2].y} x2={mapPoints[5].x} y2={mapPoints[5].y} stroke="#cc1616" strokeWidth="0.1" opacity="0.3" strokeDasharray="0.5 1.5" />
              <line x1={mapPoints[3].x} y1={mapPoints[3].y} x2={mapPoints[6].x} y2={mapPoints[6].y} stroke="#cc1616" strokeWidth="0.1" opacity="0.3" strokeDasharray="0.5 1.5" />
              <line x1={mapPoints[3].x} y1={mapPoints[3].y} x2={mapPoints[4].x} y2={mapPoints[4].y} stroke="#cc1616" strokeWidth="0.1" opacity="0.3" strokeDasharray="0.5 1.5" />

              {/* Points */}
              {mapPoints.map((point) => (
                <g key={point.label}>
                  {/* Outer pulse */}
                  <circle cx={point.x} cy={point.y} r="2" fill="#cc1616" opacity="0.1">
                    <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Inner glowing dot */}
                  <circle cx={point.x} cy={point.y} r="0.6" fill="#cc1616" />
                  <circle cx={point.x} cy={point.y} r="0.3" fill="var(--color-text-primary)" opacity="0.8" />
                  {/* Label */}
                  <text
                    x={point.x}
                    y={point.y - 1.8}
                    textAnchor="middle"
                    fontSize="1.6"
                    fill="var(--color-text-secondary)"
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em' }}
                  >
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>


          </div>

        </div>
      </div>
    </section>
  );
}
