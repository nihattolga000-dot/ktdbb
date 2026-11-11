import { ArrowRight, Users, ChevronDown } from 'lucide-react';
import TurkicThinkers from './TurkicThinkers';

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="bg-bozkurt-pattern"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#09090b', // Sinematik koyu zemin (açık temada solmayı engeller)
        overflow: 'hidden',
      }}
    >
      {/* Background Image - Mustafa Kemal Atatürk Kalpaklı Canlı Gözleri (4K Responsive) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/ataturk-kalpak-eyes.jpg"
          alt="Gazi Mustafa Kemal Atatürk Gözleri"
          className="w-full h-full object-cover object-[50%_18%] sm:object-[45%_25%] md:object-[35%_center] lg:object-[28%_center]"
          style={{
            opacity: 0.95,
            filter: 'contrast(115%) saturate(125%) brightness(96%)',
          }}
          loading="eager"
        />

        {/* Masaüstünde sağdan sola karartma (Metinlerin arkasını kusursuz koyulaştırır) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.85) 45%, rgba(9,9,11,0.2) 75%, transparent 100%)',
          }}
        />

        {/* Mobilde yukarıdan aşağıya karartma (Gözler üstte parlar, alt kısımdaki metinler koyu zeminde net okunur) */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.92) 55%, rgba(9,9,11,0.2) 85%, transparent 100%)',
          }}
        />

        {/* Üst ve alt yumuşak kenar geçişleri */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(9,9,11,0.7) 0%, transparent 20%, transparent 80%, #09090b 100%)',
          }}
        />
      </div>

      <div className="container-custom relative z-10 w-full pt-36 sm:pt-32 md:pt-20 lg:pt-0 pb-16 md:pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-center">

          {/* Left Side: Empty to showcase the warrior */}
          <div className="lg:col-span-5 hidden lg:block"></div>

          {/* Right Side: Typography */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-end text-center lg:text-right">

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#cc1616',
                  textShadow: '0 2px 10px color-mix(in srgb, var(--color-bg-primary) 50%, transparent)',
                }}
              >
                Kızılelma Yolunda
              </span>
              <div className="hidden lg:block" style={{ width: '40px', height: '2px', background: '#cc1616' }} />
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="items-center lg:items-end"
            >
              <span style={{ color: '#ffffff', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>YA İSTİKLAL,</span>
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px #cc1616',
                  filter: 'drop-shadow(0 0 15px rgba(204,22,22,0.5))',
                }}
              >
                YA ÖLÜM!
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.82)',
                lineHeight: 1.8,
                marginBottom: '3rem',
                maxWidth: '600px',
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
              className="border-r-0 lg:border-r-2 lg:pr-6 border-red-600/50 italic"
            >
              "Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!"
              <br />
              <span className="text-sm text-red-500 font-bold mt-2 block not-italic">— Mustafa Kemal Atatürk</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap justify-center lg:justify-end">
              <button
                onClick={() => scrollTo('#katil')}
                className="w-full sm:w-auto justify-center"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2.5rem',
                  background: 'linear-gradient(90deg, #cc1616 0%, #a81010 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px -5px rgba(204,22,22,0.5)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 15px 35px -5px rgba(204,22,22,0.7)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 25px -5px rgba(204,22,22,0.5)';
                }}
              >
                <Users size={16} />
                Bize Katıl
              </button>

              <button
                onClick={() => scrollTo('#hakkimizda')}
                className="w-full sm:w-auto justify-center"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.18)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Keşfet
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>


      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.7,
          cursor: 'pointer',
        }}
        onClick={() => scrollTo('#hakkimizda')}
      >
        <div style={{ animation: 'bounce 2s infinite' }}>
          <ChevronDown size={24} color="#cc1616" />
        </div>
      </div>

      {/* Turkic Quotes - Absolute Bottom Left */}
      <div
        className="hidden lg:block z-30"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem'
        }}
      >
        <TurkicThinkers />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}
