'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 2400, suffix: '+', label: 'Aktif Üretici', display: '2.400+' },
  { value: 185, suffix: 'M+', prefix: '₺', label: 'Toplam Kazanılan', display: '₺18.5M+' },
  { value: 47000, suffix: '+', label: 'Destekçi', display: '47.000+' },
  { value: 48, suffix: '/5', divisor: 10, label: 'Ortalama Memnuniyet', display: '4.8/5' },
];

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({
  stat,
  active,
}: {
  stat: (typeof stats)[0];
  active: boolean;
}) {
  const raw = useCountUp(stat.value, active);
  const formatted =
    stat.divisor
      ? (raw / stat.divisor).toFixed(1)
      : raw.toLocaleString('tr-TR');
  const displayValue = active
    ? `${stat.prefix ?? ''}${formatted}${stat.suffix}`
    : stat.display;

  return (
    <div className="text-center">
      <div
        className="text-[52px] font-extrabold leading-none tracking-tight text-orange"
      >
        {displayValue}
      </div>
      <p className="mt-3 text-sm font-medium text-white/60">{stat.label}</p>
    </div>
  );
}

export default function Rakamlar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ backgroundColor: '#1a1a1a' }} className="py-24 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
