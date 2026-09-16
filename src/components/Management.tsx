export default function Management() {
  return (
    <section
      id="yonetim"
      className="section-padding bg-bozkurt-pattern"
      style={{
        background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12"
        >
          {/* Left: Big Photo */}
          <div className="w-full lg:w-1/2 flex">
            <div style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(204,22,22,0.3)',
              boxShadow: '0 10px 40px rgba(204,22,22,0.15)',
              width: '100%'
            }}>
              <img
                src="/images/661439943_18087937406581627_3186380093622717994_n.jpg"
                alt="Rabia Coşkun"
                className="w-full h-full object-cover"
                style={{
                  display: 'block',
                  minHeight: '400px'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, color-mix(in srgb, var(--color-bg-primary) 95%, transparent), transparent)',
                padding: '3rem 1.5rem 1.5rem 1.5rem',
              }}>
                <p style={{
                  color: '#cc1616',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '1.1rem'
                }}>İl Başkanı</p>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="editorial-eyebrow">Liderlik</div>
            <h2 className="editorial-title" style={{ marginBottom: '2rem' }}>RABİA COŞKUN</h2>

            <div style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              borderRadius: '8px',
              position: 'relative'
            }}>
              {/* Decorative accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: '#cc1616',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px'
              }} />

              <h3 style={{
                fontFamily: "'Oswald', sans-serif",
                color: 'var(--color-text-primary)',
                fontSize: '1.4rem',
                marginBottom: '1.5rem',
                letterSpacing: '0.03em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ color: '#cc1616' }}>🇹🇷</span> Türk Milleti İçin Yaptıkları
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Çerçeve Yasa ve Af Sürecine Karşı Duruş:</strong> TBMM'de kabul edilen "Milli Dayanışma ve Toplumsal Bütünleşmenin Güçlendirilmesine Dair Kanun" (kamuoyunda Çerçeve Yasa veya terör örgütü üyelerine yönelik af/çözüm süreci olarak bilinen düzenleme) karşısında net bir protesto tavrı koymuştur. Bu yasayı "Türk milletine yönelik bir kabul edilemez durum" olarak nitelendirmiştir.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Şehitlerin Hatırasını Savunma:</strong> Kayseri Cumhuriyet Meydanı'ndaki protestoda terör örgütü elebaşlarının fotoğraflarını yırtarak, "Şehitlerimizin hesabı sorulacak, hiçbir zaman bir şehit anasının hakkı yerde kalmayacak" çıkışıyla terörle mücadele ve şehit yakınlarının hassasiyetlerini dile getirmiştir.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Türk Milliyetçiliği Misyonu:</strong> Yaptığı açıklamada, "Ömrümün sonuna kadar Türk milliyetçisi olarak yaşamaya devam edeceğim. Ulu Başbuğ Mustafa Kemal Atatürk'ün izinden gitmeye devam edeceğim" diyerek Atatürk ilke ve inkılapları doğrultusunda bir mücadele yürüttüğünü vurgulamıştır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
