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
        background: 'var(--color-bg-primary)', // Deep dark reddish black
        overflow: 'hidden',
      }}
    >
      {/* Background Image - Ancient Turkic Warrior */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/hero-bg.jpg"
          alt="Turkic Warrior"
          className="w-full h-full object-cover object-[35%_center] md:object-center"
          style={{
            opacity: 0.65,
            filter: 'contrast(110%) saturate(120%)',
          }}
          loading="eager"
        />
        {/* Dark gradient overlay to ensure text readability on the right side */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to left, color-mix(in srgb, var(--color-bg-primary) 95%, transparent) 0%, color-mix(in srgb, var(--color-bg-primary) 70%, transparent) 40%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, color-mix(in srgb, var(--color-bg-primary) 100%, transparent) 0%, rgba(10,5,5,0) 25%)',
          }}
        />
      </div>

      <div className="container-custom relative z-10 w-full" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
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
              <span style={{ color: 'var(--color-text-primary)', textShadow: '0 10px 30px color-mix(in srgb, var(--color-bg-primary) 80%, transparent)' }}>YURTTA SULH,</span>
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px #cc1616',
                  filter: 'drop-shadow(0 0 15px rgba(204,22,22,0.4))',
                }}
              >
                CİHANDA SULH!
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '3rem',
                maxWidth: '600px',
                fontWeight: 400,
                textShadow: '0 2px 10px color-mix(in srgb, var(--color-bg-primary) 80%, transparent)',
              }}
              className="border-r-0 lg:border-r-2 lg:pr-6 border-red-600/50 italic"
            >
              "Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!"
              <br/>
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
                  color: 'var(--color-text-primary)',
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
                  background: 'color-mix(in srgb, var(--color-bg-card) 40%, transparent)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
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
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-border)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-text-muted)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'color-mix(in srgb, var(--color-bg-card) 40%, transparent)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-light)';
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
