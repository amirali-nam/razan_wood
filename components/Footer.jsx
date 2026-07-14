import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <h4>رزان | دستسازه‌های چوبی</h4>
            <p>
              woodcarving · home decor · handmade
              <br />
              رنگ زندگی بر تن چوب 🌱
            </p>
          </div>
          <div className="foot-quick">
            <h4>دسترسی سریع</h4>
            <Link href="/products/">محصولات</Link>
            <Link href="/gallery/">گالری</Link>
            <Link href="/custom-order/">سفارش سفارشی</Link>
            <Link href="/about/">قصه‌ی رزان</Link>
          </div>
          <div>
            <h4>ارتباط با ما</h4>
            <a href={SITE.instagram} target="_blank" rel="noopener">اینستاگرام razan.wood</a>
            <a href={`https://wa.me/${SITE.waNumber}`} target="_blank" rel="noopener">
              واتساپ {SITE.phoneDisplay}
            </a>
            <a href={SITE.igDirect} target="_blank" rel="noopener">دایرکت اینستاگرام</a>
          </div>
        </div>
        <div className="copyright">
           رزان — تمام حقوق محفوظ است.
          <span className="dev-credit">
            {' · '}ساخته شده توسط{' '}
            <a href={SITE.developer.github} target="_blank" rel="noopener">
              {SITE.developer.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
