import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out at 3 seconds
    const fadeTimer = setTimeout(() => setFade(true), 3000);
    // Completely remove from DOM at 3.8 seconds
    const removeTimer = setTimeout(() => setShow(false), 3800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        background: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? 'none' : 'auto',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: fade ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Subtle Background Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(204,22,22,0.15) 0%, transparent 60%)',
          animation: 'pulseGlow 3s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {/* Göktürk Runes for "TÜRK" - Read right to left in original, but we just display them here. 
            Letters: 𐱅 (T), 𐰇 (Ü), 𐰼 (R), 𐰰 (K) 
        */}
        {['𐱅', '𐰇', '𐰼', '𐰰'].map((rune, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Segoe UI Historic', 'Apple Symbols', sans-serif",
              fontSize: 'clamp(4rem, 8vw, 6rem)',
              color: '#cc1616',
              opacity: 0,
              animation: `runeReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${i * 0.25}s, runeGlow 2s ease-in-out infinite alternate 1s`,
            }}
          >
            {rune}
          </span>
        ))}
      </div>
      
      <div 
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Oswald', sans-serif",
          color: 'var(--color-text-primary)',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
          opacity: 0,
          animation: 'fadeInUp 1s ease forwards 1.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>Kayseri Turancı Dernekler Birliği</span>
        <div 
          style={{
            width: '40px',
            height: '2px',
            background: '#cc1616',
            marginTop: '0.5rem',
            animation: 'expandLine 1s ease forwards 1.5s',
            opacity: 0,
          }}
        />
      </div>

      <style>{`
        @keyframes runeReveal {
          0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); text-shadow: 0 0 30px rgba(204,22,22,0.5); }
        }
        @keyframes runeGlow {
          0% { text-shadow: 0 0 30px rgba(204,22,22,0.5); color: #cc1616; }
          100% { text-shadow: 0 0 50px rgba(204,22,22,0.9), 0 0 100px rgba(204,22,22,0.4); color: #ff4d4d; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); letter-spacing: 0.2em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.4em; }
        }
        @keyframes expandLine {
          0% { opacity: 0; width: 0px; }
          100% { opacity: 1; width: 60px; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
