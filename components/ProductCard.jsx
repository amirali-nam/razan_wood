'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { SITE, waLink, faNum } from '@/lib/site';
import InstagramIcon from '@/components/InstagramIcon';
import WhatsappIcon from '@/components/WhatsappIcon';

/* کارت چندعکسی: با نگه‌داشتن موس، عکس‌های محصول ورق می‌خورند */
export default function ProductCard({ product, delay = 0 }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const many = product.images.length > 1;

  const start = () => {
    if (!many || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = setInterval(
      () => setIdx((i) => (i + 1) % product.images.length),
      1400
    );
  };
  const stop = () => {
    clearInterval(timer.current);
    setIdx(0);
  };

  return (
    <article
      className="card reveal"
      style={{ '--rd': `${delay}s` }}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <Link href={`/products/${product.slug}/`} className="card-img" title={product.name}>
        {product.images.map((src, j) => (
          <img
            key={src}
            src={src}
            alt={`${product.name} — عکس ${faNum(j + 1)}`}
            loading="lazy"
            className={j === idx ? 'cur' : ''}
          />
        ))}
        {many && (
          <>
            <div className="pic-dots">
              {product.images.map((_, j) => (
                <i key={j} className={j === idx ? 'on' : ''} />
              ))}
            </div>
            <span className="multi-badge">{faNum(product.images.length)} عکس</span>
          </>
        )}
      </Link>
      <div className="card-body">
        <span className="cat-tag">{product.cat}</span>
        <h3>
          <Link href={`/products/${product.slug}/`}>{product.name}</Link>
        </h3>
        <p>{product.desc}</p>
        <div className="price">{product.price}</div>
        <div className="card-actions">
          <a className="act-dm" href={SITE.igDirect} target="_blank" rel="noopener">
            <InstagramIcon size={16} />
            سفارش در دایرکت
          </a>
          <a
            className="act-wa"
            href={waLink(`سلام 🌱 برای سفارش «${product.name}» از سایت رزان پیام می‌دم.`)}
            target="_blank"
            rel="noopener"
          >
            <WhatsappIcon size={16} />
            واتساپ
          </a>
        </div>
      </div>
    </article>
  );
}
