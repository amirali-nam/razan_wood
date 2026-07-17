'use client';
import { useRef, useState } from 'react';

/* ویدیوی هیرو — خودکار و بی‌صدا شروع می‌شود (سیاست مرورگر)،
   با دکمه‌ای کاربر صدا را روشن می‌کند */
export default function HeroVideo() {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play?.();
  };

  return (
    <>
      <video
        ref={ref}
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-label="ویدیوی برند رزان"
      />
      <button
        type="button"
        className="hero-sound"
        onClick={toggle}
        aria-label={muted ? 'روشن‌کردن صدا' : 'قطع صدا'}
        title={muted ? 'روشن‌کردن صدا' : 'قطع صدا'}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}
