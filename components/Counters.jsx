'use client';
import { useEffect, useRef, useState } from 'react';
import { faNum } from '@/lib/site';

function Counter({ end, suffix }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);

  return (
    <div className="num" ref={ref}>
      {faNum(val.toLocaleString('en').replace(/,/g, '٬'))}
      {done ? suffix : ''}
    </div>
  );
}

export default function Counters() {
  return (
    <div className="about-stats">
      <div>
        <Counter end={120} suffix="+" />
        <span>محصول منتشرشده</span>
      </div>
      <div>
        <Counter end={7500} suffix="+" />
        <span>دنبال‌کننده</span>
      </div>
      <div>
        <Counter end={6} suffix=" سال" />
        <span>سابقه فعالیت</span>
      </div>
    </div>
  );
}
