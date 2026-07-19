'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';

const LINKS = [
  { href: '/', label: 'خانه' },
  { href: '/products/', label: 'محصولات' },
  { href: '/gallery/', label: 'گالری' },
  { href: '/custom-order/', label: 'محصول سفارشی' },
  { href: '/about/', label: 'قصه‌ی رزان' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <img src="/logo.png" alt="لوگوی رزان" className="logo-img" />
          <span>
            <img src="/razan-wordmark.png" alt="رزان" className="brand-wordmark" />
            <small>Handicraft Woods</small>
          </span>
        </Link>
        <nav className={open ? 'open' : ''}>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={path === l.href ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a className="nav-cta" href={SITE.igDirect} target="_blank" rel="noopener">
                سفارش در دایرکت
              </a>
            </li>
          </ul>
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="منو">☰</button>
      </div>
    </header>
  );
}
