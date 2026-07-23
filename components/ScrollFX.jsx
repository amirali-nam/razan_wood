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
    // یک عنصر و همه‌ی .reveal های داخلش را observe می‌کند
    const observeAll = (root) => {
      if (!root || root.nodeType !== 1) return;
      if (root.classList.contains('reveal') && !root.classList.contains('show')) io.observe(root);
      root.querySelectorAll('.reveal:not(.show)').forEach((el) => io.observe(el));
    };
    observeAll(document.body);
    // کارت‌هایی که بعداً (مثلاً با فیلترِ محصولات) به صفحه اضافه می‌شوند هم گرفته می‌شوند
    const mo = new MutationObserver((muts) =>
      muts.forEach((m) => m.addedNodes.forEach((n) => observeAll(n)))
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [path]);

  return null;
}
