'use client';
import { useEffect, useState } from 'react';
import { REVIEWS } from '@/lib/content';

export default function Reviews() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="reviews-band">
      <div className="container">
        <div className="sec-head reveal">
          <h2>مشتری‌ها چه می‌گویند</h2>
          <p style={{ fontSize: '.85rem' }}>
            (نمونه — نظرات واقعی مشتری‌ها از دایرکت جایگزین می‌شود)
          </p>
        </div>
        <div className="review-stage reveal">
          {REVIEWS.map((r, i) => (
            <div key={i} className={`review ${i === idx ? 'on' : ''}`}>
              <div className="stars">★★★★★</div>
              <q>{r.text}</q>
              <div className="who">— {r.who}</div>
            </div>
          ))}
        </div>
        <div className="dots">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              className={i === idx ? 'on' : ''}
              aria-label={`نظر ${i + 1}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
