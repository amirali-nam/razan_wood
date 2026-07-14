'use client';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import InstagramIcon from '@/components/InstagramIcon';
import WhatsappIcon from '@/components/WhatsappIcon';

export default function FloatingCTA() {
  const [on, setOn] = useState(false);
  const [top, setTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setOn(scrollY > 500);
      setTop(scrollY > 900);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className={`float-cta ${on ? 'on' : ''}`}>
        <a className="fc-dm" href={SITE.igDirect} target="_blank" rel="noopener">
          <InstagramIcon size={17} />
          سفارش در دایرکت
        </a>
        <a className="fc-wa" href={`https://wa.me/${SITE.waNumber}`} target="_blank" rel="noopener">
          <WhatsappIcon size={17} />
          واتساپ
        </a>
      </div>
      <button
        id="toTop"
        className={top ? 'on' : ''}
        aria-label="بازگشت به بالا"
        onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
