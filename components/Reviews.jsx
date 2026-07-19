'use client';
import { useEffect, useState } from 'react';
import { REVIEWS as FALLBACK } from '@/lib/content';

function Stars({ n = 5 }) {
  const full = Math.min(5, Math.max(1, Number(n) || 5));
  return (
    <div className="stars" aria-label={`${full} از ۵ ستاره`}>
      <span className="on">{'★'.repeat(full)}</span>
      <span className="off">{'★'.repeat(5 - full)}</span>
    </div>
  );
}

export default function Reviews({ reviews }) {
  const list = reviews && reviews.length ? reviews : FALLBACK;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);

  if (!list.length) return null;

  return (
    <section className="reviews-band">
      <div className="container">
        <div className="sec-head reveal">
          <h2>مشتری‌ها چه می‌گویند</h2>
        </div>
        <div className="review-stage reveal">
          {list.map((r, i) => (
            <div key={r.id ?? i} className={`review ${i === idx ? 'on' : ''}`}>
              <Stars n={r.rating} />
              <q>{r.text}</q>
              {r.who && <div className="who">— {r.who}</div>}
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <div className="dots">
            {list.map((_, i) => (
              <button
                key={i}
                className={i === idx ? 'on' : ''}
                aria-label={`نظر ${i + 1}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
