'use client';
import { useEffect, useRef, useState } from 'react';

/* ویترین سینمایی: عکس‌ها با زوم آرام (کن‌برنز) نمایش داده می‌شوند */
export default function Spotlight({ products }) {
  const slides = products.map((p) => ({
    name: p.name,
    desc: p.desc,
    src: p.images[0],
    slug: p.slug,
  }));
  const [idx, setIdx] = useState(0);
  const [barKey, setBarKey] = useState(0);
  const timer = useRef(null);

  const restart = (i) => {
    setIdx(i);
    setBarKey((k) => k + 1);
  };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = setInterval(() => restart((idx + 1) % slides.length), 7500);
    return () => clearInterval(timer.current);
  }, [idx, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="spotlight" id="spotlight">
      <div className="container">
        <div className="sec-head reveal">
          <h2>نمای نزدیک</h2>
          <p>ظرافت حکاکی را از نزدیک ببینید — هر قطعه، ساعت‌ها کارِ دست است.</p>
        </div>
        <div className="spot-stage reveal">
          {slides.map((s, i) => (
            <div key={s.slug} className={`spot-slide ${i === idx ? 'on' : ''}`}>
              <img src={s.src} alt={s.name} loading={i === 0 ? 'eager' : 'lazy'} />
              <div className="spot-cap">
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
                <a href={`/products/${s.slug}/`}>دیدن این کار</a>
              </div>
            </div>
          ))}
          <div key={barKey} className="spot-progress run" />
        </div>
        <div className="spot-nav">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              className={`spot-thumb ${i === idx ? 'on' : ''}`}
              aria-label={s.name}
              onClick={() => restart(i)}
            >
              <img src={s.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
