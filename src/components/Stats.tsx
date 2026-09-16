import { useEffect, useRef, useState } from 'react';
import { statsConfig } from '../data/config';

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderRight: '1px solid var(--color-border)',
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(2.8rem, 5vw, 4rem)',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}
      >
        {count.toLocaleString('tr-TR')}
        <span style={{ color: '#cc1616' }}>{suffix}</span>
      </div>
      <div
        style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {statsConfig.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: '1 1 150px',
                borderRight:
                  i < statsConfig.length - 1
                    ? '1px solid var(--color-border)'
                    : 'none',
              }}
            >
              <StatItem value={stat.value} label={stat.label} suffix={stat.suffix} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
