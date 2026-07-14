'use client';
import { useEffect, useRef } from 'react';

/* برگ‌های شناور + تیتر کلمه‌به‌کلمه در هیرو */
export function HeroLeaves() {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = ref.current?.closest('.hero');
    if (!hero) return;
    const leaves = [];
    for (let i = 0; i < 7; i++) {
      const l = document.createElement('div');
      l.className = 'leaf';
      l.style.setProperty('--x', 5 + Math.random() * 90 + '%');
      l.style.setProperty('--t', 9 + Math.random() * 8 + 's');
      l.style.setProperty('--d', Math.random() * 10 + 's');
      const s = 12 + Math.random() * 10;
      l.innerHTML = `<svg width="${s}" height="${s}" viewBox="0 0 20 20"><path d="M10 1 C15 6 15 13 10 19 C5 13 5 6 10 1Z" fill="#8fae91" opacity=".55"/></svg>`;
      hero.appendChild(l);
      leaves.push(l);
    }
    return () => leaves.forEach((l) => l.remove());
  }, []);
  return <span ref={ref} style={{ display: 'none' }} />;
}

export function RisingTitle({ children }) {
  // children: رشته‌ی متن؛ کلمه‌به‌کلمه بالا می‌آید
  let d = 0;
  const parts = String(children).split(' ');
  return (
    <>
      {parts.map((w, i) => (
        <span className="w" key={i}>
          <i style={{ '--d': `${d++ * 0.12}s` }}>{w}</i>{' '}
        </span>
      ))}
    </>
  );
}
