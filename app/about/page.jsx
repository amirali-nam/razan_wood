import Counters from '@/components/Counters';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'قصه‌ی رزان',
  description: 'قصه‌ی رزان — از انتخاب چوب گردو تا حکاکی دستی و رسیدن به خانه‌ی شما.',
};

export default function AboutPage() {
  return (
    <>
      <div className="page-head">
        <h1>قصه‌ی رزان</h1>
        <p>رنگ زندگی بر تن چوب — سه سال کنار چوب، مغار و صبر.</p>
      </div>

      {/* بنر سینمایی — پشت‌بام یزد با تابلوی رزان */}
      <figure className="about-hero reveal">
        <img
          src="/images/about-rooftop.jpg"
          alt="بانوی رزان با تابلوی حکاکی‌شده‌ی لوگوی رزان بر پشت‌بام بادگیرهای یزد"
        />
        <figcaption>
          <img src="/razan-wordmark-light.png" alt="رزان" className="hero-wordmark" />
          <span>حکاکی دستی · یزد</span>
        </figcaption>
      </figure>

      <section style={{ paddingTop: 36 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="reveal" style={{ color: '#5d4c3b', marginBottom: 16 }}>
            رزان از عشق به چوب و هنر دستی شروع شد؛ از اولین گلی که روی یک تکه چوب گردو
            حکاکی شد. امروز بعد از بیش از سه سال، صدها قطعه از کارگاه رزان به خانه‌هایی در
            سراسر ایران رفته‌اند — قندان‌ها، جعبه‌ها، تابلوها و نوشت‌افزارهایی که هرکدام
            ساعت‌ها زیر دست بوده‌اند و هیچ دوتایی‌شان دقیقاً مثل هم نیستند.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="sec-head reveal"><h2>هر قطعه چطور ساخته می‌شود؟</h2></div>
          <div className="story-steps">
            <div className="story-step reveal">
              <div className="sn">۱</div>
              <div>
                <h3>انتخاب چوب</h3>
                <p>
                  همه‌چیز از انتخاب چوب شروع می‌شود؛ گردویی که رگه‌هایش قصه‌ی سال‌ها را در
                  خود دارد. هیچ دو تکه چوبی مثل هم نیستند — برای همین هیچ دو محصول رزان هم
                  مثل هم نیست.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۲</div>
              <div>
                <h3>خراطی و فرم</h3>
                <p>
                  فرم کلی قطعه — پایه‌ها، بدنه‌ها و درب‌ها — با خراطی شکل می‌گیرد تا نسبت‌ها
                  درست و اتصال‌ها دقیق باشند.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۳</div>
              <div>
                <h3>حکاکی، گل به گل</h3>
                <p>
                  گل‌ها و شاخ‌وبرگ‌ها با مغار و دستِ صبور روی تنِ چوب می‌نشینند. هر گل
                  ساعت‌ها زمان می‌برد؛ و همین زمان است که به هر قطعه جان می‌دهد.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۴</div>
              <div>
                <h3>پرداخت و روغن</h3>
                <p>
                  سطح کار سمباده و پرداخت می‌شود و با روغن‌های مخصوص چوب تغذیه می‌شود تا
                  رنگ گرم گردو زنده بماند و سال‌ها دوام بیاورد.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۵</div>
              <div>
                <h3>تا خانه‌ی شما</h3>
                <p>
                  با بسته‌بندی چندلایه‌ی مطمئن به سراسر ایران ارسال می‌شود — از میز یلدا تا
                  سفره‌ی هفت‌سین، جایی که زندگی جریان دارد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* گالری کارگاه — دو قاب دستی */}
      <section style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="sec-head reveal"><h2>در کارگاه رزان</h2></div>
          <div className="craft-gallery">
            <figure className="reveal">
              <img
                src="/images/artisan-workshop.jpg"
                alt="میز کار رزان؛ مغارها، قطعات چوب و دستانِ در حال ساخت"
                loading="lazy"
              />
              <figcaption>میزِ کار و ابزارها</figcaption>
            </figure>
            <figure className="reveal" style={{ '--rd': '.12s' }}>
              <img
                src="/images/artisan-carving.jpg"
                alt="حکاکی نزدیک؛ گل‌ها گل به گل روی تنِ چوب نقش می‌بندند"
                loading="lazy"
              />
              <figcaption>حکاکی، گل به گل</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="about-band">
        <div className="container about-grid">
          <div className="reveal">
            <h2>رزان در یک نگاه</h2>
            <p>
              بیش از ۱۲۰ کار منتشرشده، بیش از ۷٬۵۰۰ همراه در اینستاگرام و شش سال تجربه‌ی
              ساخت و ارسال به سراسر ایران.
            </p>
            <a className="btn btn-primary" href={SITE.instagram} target="_blank" rel="noopener" style={{ marginTop: 10 }}>
              دیدن کارها در اینستاگرام
            </a>
          </div>
          <div className="about-card reveal" style={{ '--rd': '.15s' }}>
            <Counters />
          </div>
        </div>
      </section>
    </>
  );
}
