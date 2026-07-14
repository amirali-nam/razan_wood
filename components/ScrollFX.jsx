'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* افکت‌های سراسری اسکرول: نوار پیشرفت + نمایان‌شدن .reveal ها */
export default function ScrollFX() {
  const path = usePathname();

  useEffect(() => {
    const bar = document.getElementById('progress');
    const onScroll = () => {
      const h = document.documentElement;
      if (bar) bar.style.width = (scrollY / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  return null;
}
