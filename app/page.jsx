import Link from 'next/link';
import { getProducts, getReviews } from '@/lib/db';
import { FAQS } from '@/lib/content';
import { SITE } from '@/lib/site';
import ProductCard from '@/components/ProductCard';
import Spotlight from '@/components/Spotlight';
import Reviews from '@/components/Reviews';
import Counters from '@/components/Counters';
import { HeroLeaves, RisingTitle } from '@/components/HeroFX';

export const dynamic = 'force-dynamic';

export default function Home() {
  const products = getProducts();
  const reviews = getReviews();
  // صفحه‌ی اول همیشه دقیقاً ۶ محصول نشان می‌دهد:
  // اول منتخب‌ها، اگر کمتر از ۶ بود با بقیه پر می‌شود؛ بیشترش فقط در صفحه‌ی محصولات
  const featured = [
    ...products.filter((p) => p.featured),
    ...products.filter((p) => !p.featured),
  ].slice(0, 6);

  return (
    <>
      {/* ============ هیرو ============ */}
      <section className="hero">
        <HeroLeaves />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">🌱 دست‌ساز، با عشق، از دلِ چوب</span>
            <h1>
              <RisingTitle>رزان؛</RisingTitle>
              <em><RisingTitle>رنگِ زندگی</RisingTitle></em>
              <br />
              <RisingTitle>بر تنِ چوب</RisingTitle>
            </h1>
            <p>
              هر قطعه‌ی رزان با دست حکاکی می‌شود؛ از قندان‌ها و جعبه‌های منبت تا تابلو و
              نوشت‌افزار چوبی. چوبی که قصه دارد، برای خانه‌ای که حس دارد.
            </p>
            <div className="hero-btns">
              <Link className="btn btn-primary" href="/products/">مشاهده محصولات</Link>
              <Link className="btn btn-ghost" href="/custom-order/">سفارش طرح دلخواه</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="arch">
              <img src="/images/pedestal-bowl-1.jpg" alt="قندان پایه‌دار منبت رزان" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ نوار اعتماد ============ */}
      <div className="trust">
        <div className="container trust-grid">
          <div className="trust-item reveal"><b>۱۰۰٪ دست‌ساز</b><span>حکاکی و منبت با دست</span></div>
          <div className="trust-item reveal" style={{ '--rd': '.1s' }}><b>چوب طبیعی</b><span>گردو و چوب‌های مرغوب</span></div>
          <div className="trust-item reveal" style={{ '--rd': '.2s' }}><b>+۳ سال تجربه</b><span>و صدها سفارش موفق</span></div>
          <div className="trust-item reveal" style={{ '--rd': '.3s' }}><b>ارسال به سراسر ایران</b><span>بسته‌بندی مطمئن</span></div>
        </div>
      </div>

      {/* ============ ویترین سینمایی ============ */}
      <Spotlight products={products} />

      {/* ============ منتخب محصولات ============ */}
      <section>
        <div className="container">
          <div className="sec-head reveal">
            <h2>منتخب دستسازه‌ها</h2>
            <p>روی هر محصول بزنید تا صفحه‌ی اختصاصی‌اش با همه‌ی عکس‌ها باز شود.</p>
          </div>
          <div className="grid">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} delay={(i % 4) * 0.08} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link className="btn btn-primary" href="/products/">دیدن همه‌ی محصولات</Link>
          </div>
        </div>
      </section>

      {/* ============ درباره (خلاصه) ============ */}
      <section className="about-band">
        <div className="container about-grid">
          <div className="reveal">
            <h2>قصه‌ی رزان</h2>
            <p>
              رزان از عشق به چوب و هنر دستی شروع شد؛ از حکاکیِ گل‌ها و شاخ‌وبرگ روی تنِ چوب
              گردو. هر محصول ساعت‌ها زمان می‌برد و هیچ دو قطعه‌ای دقیقاً مثل هم نیستند.
            </p>
            <div className="about-card" style={{ margin: '20px 0' }}>
              <Counters />
            </div>
            <Link className="btn btn-primary" href="/about/">
              خواندن قصه‌ی کامل
            </Link>
          </div>
          <figure className="about-photo reveal" style={{ '--rd': '.15s' }}>
            <img
              src="/images/artisan-workshop.jpg"
              alt="هنرمند رزان در حال حکاکی و پرداختِ یک قطعه‌ی چوبی در کارگاه"
              loading="lazy"
            />
            <figcaption>
              <span className="dot" />
              دستانِ پشتِ هر قطعه
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============ نظرات ============ */}
      <Reviews reviews={reviews} />

      {/* ============ روش سفارش ============ */}
      <section>
        <div className="container">
          <div className="sec-head reveal">
            <h2>سفارش در ۳ قدم ساده</h2>
            <p>سفارش‌ها مستقیم در دایرکت اینستاگرام یا واتساپ ثبت می‌شوند — راحت، سریع و بی‌واسطه.</p>
          </div>
          <div className="steps">
            <div className="step reveal"><div className="n">۱</div><h3>محصول را انتخاب کنید</h3><p>از بین دستسازه‌ها یا با ثبت طرح دلخواه خودتان.</p></div>
            <div className="step reveal" style={{ '--rd': '.12s' }}><div className="n">۲</div><h3>پیام بدهید</h3><p>با یک کلیک به دایرکت یا واتساپ رزان وصل می‌شوید؛ نام محصول آماده در پیام هست.</p></div>
            <div className="step reveal" style={{ '--rd': '.24s' }}><div className="n">۳</div><h3>ساخت و ارسال</h3><p>سفارش شما با دست ساخته، بسته‌بندی و به سراسر ایران ارسال می‌شود.</p></div>
          </div>
        </div>
      </section>

      {/* ============ سوالات ============ */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sec-head reveal"><h2>سوالات پرتکرار</h2></div>
          <div className="faq-list reveal">
            {FAQS.map((f) => (
              <details className="faq" key={f.q}>
                <summary>{f.q}</summary>
                <div className="a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <div className="container">
        <div className="cta reveal">
          <h2>یک قطعه از رزان، برای خانه‌ی شما</h2>
          <p>همین حالا سفارش‌تان را در دایرکت یا واتساپ ثبت کنید.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="btn btn-wa" href={`https://wa.me/${SITE.waNumber}`} target="_blank" rel="noopener">سفارش در واتساپ</a>
            <a className="btn btn-ghost" href={SITE.igDirect} target="_blank" rel="noopener">سفارش در دایرکت</a>
          </div>
        </div>
      </div>
    </>
  );
}
