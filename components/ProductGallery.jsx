'use client';
import { useState } from 'react';
import { faNum } from '@/lib/site';

/* گالری صفحه‌ی محصول: عکس بزرگ + بندانگشتی‌ها + لایت‌باکس */
export default function ProductGallery({ product }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <div
        className="pgal-main"
        onClick={() => setZoom(true)}
        style={{ cursor: 'zoom-in' }}
        title="بزرگ‌نمایی"
      >
        <img src={product.images[idx]} alt={`${product.name} — عکس ${faNum(idx + 1)}`} />
      </div>
      {product.images.length > 1 && (
        <div className="pgal-thumbs">
          {product.images.map((src, j) => (
            <button
              key={src}
              className={j === idx ? 'on' : ''}
              onClick={() => setIdx(j)}
              aria-label={`عکس ${faNum(j + 1)}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <div
        className={`lightbox ${zoom ? 'open' : ''}`}
        onClick={() => setZoom(false)}
        role="dialog"
        aria-modal="true"
      >
        <button className="lb-close" aria-label="بستن">✕</button>
        <img src={product.images[idx]} alt={product.name} />
        <div className="lb-cap">{product.name}</div>
      </div>
    </div>
  );
}
