const pillars = [
  {
    title: 'Kültürel Diplomasi',
    desc: 'Türk devletleri ve akraba topluluklar arasında sarsılmaz, stratejik köprüler kurarak ortak kültürel mirası yaşatmak.',
  },
  {
    title: 'Akademik Vizyon',
    desc: 'Tarihimizi ve dilimizi ideolojik sloganlardan arındırıp bilimsel zeminde yüceltmek; araştırma ve yayınlarla katkı sunmak.',
  },
  {
    title: 'Toplumsal Refleks',
    desc: 'Milli menfaatleri ilgilendiren konularda sivil toplumun kurumsal ve güçlü sesini kamuoyuna duyurmak.',
  },
];

export default function About() {
  return (
    <section
      id="hakkimizda"
      className="section-padding bg-bozkurt-pattern"
      style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >


      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left column */}
          <div>
            <div className="editorial-eyebrow">Temel Amacımız</div>
            <h2 className="editorial-title" style={{ marginBottom: '1.25rem' }}>
              STRATEJİK AKIL VE TARİHSEL İRADE
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
              Kayseri Turancı Dernekler Birliği; salt bir sivil toplum kuruluşu
              olmanın ötesinde — Türk dünyasının kültürel ve entelektüel inşasını
              hedefleyen bağımsız bir aydınlanma platformudur.
            </p>
          </div>

          {/* Right column */}
          <div>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.85,
                fontSize: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              Amacımız; binlerce yıllık tarihsel mirasımızı modern dünyanın
              dinamikleriyle harmanlayarak milli şuurla donatılmış yeni bir çağın
              temellerini atmaktır. Eğitimden diplomasiye, stratejik planlamadan
              kültürel entegrasyona kadar her alanda rasyonel ve bilimsel bir vizyon
              ortaya koyuyoruz.
            </p>

            {/* Pillars */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {pillars.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      background: 'var(--color-red-glow)',
                      border: '1px solid rgba(204,22,22,0.3)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#cc1616',
                      letterSpacing: '0.05em',
                      flexShrink: 0,
                    }}
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.3rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
