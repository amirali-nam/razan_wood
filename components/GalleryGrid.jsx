'use client';
import { useState } from 'react';
import Link from 'next/link';

/* گالری همه‌ی عکس‌ها به‌صورت آجری + لایت‌باکس */
export default function GalleryGrid({ products }) {
  const shots = products.flatMap((p) =>
    p.images.map((src) => ({ src, name: p.name, slug: p.slug }))
  );
  const [zoom, setZoom] = useState(null);

  return (
    <>
      <div className="masonry">
        {shots.map((s, i) => (
          <a
            key={s.src}
            href={s.src}
            onClick={(e) => {
              e.preventDefault();
              setZoom(s);
            }}
          >
            <img src={s.src} alt={s.name} loading={i < 6 ? 'eager' : 'lazy'} />
            <span className="cap">{s.name}</span>
          </a>
        ))}
      </div>
      <div
        className={`lightbox ${zoom ? 'open' : ''}`}
        onClick={() => setZoom(null)}
        role="dialog"
        aria-modal="true"
      >
        <button className="lb-close" aria-label="بستن">✕</button>
        {zoom && (
          <>
            <img src={zoom.src} alt={zoom.name} />
            <div className="lb-cap">
              {zoom.name} —{' '}
              <Link href={`/products/${zoom.slug}/`} style={{ color: 'var(--sage)' }}>
                دیدن محصول
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
