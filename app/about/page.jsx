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
        <p>رنگ زندگی بر تن چوب</p>
      </div>

      {/* بنر سینمایی — پشت‌بام یزد با تابلوی رزان */}
      <figure className="about-hero reveal">
        <img
          src="/images/about-rooftop.jpg"
          alt="بانوی رزان با تابلوی حکاکی‌شده‌ی لوگوی رزان بر پشت‌بام بادگیرهای یزد"
        />
        <figcaption>
          <img src="/razan-wordmark-light.png" alt="رزان" className="hero-wordmark" />
          <span>منبت‌کاری</span>
        </figcaption>
      </figure>

      <section style={{ paddingTop: 36 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="reveal" style={{ color: '#5d4c3b', marginBottom: 16 }}>
            رزان از عشق به چوب و هنر دست آغاز شد؛ از اولین نقشی که روی یک تکه چوب گردو جان
            گرفت. در این سال‌ها، صدها قطعه از کارگاه رزان راهی خانه‌هایی در سراسر ایران
            شده‌اند؛ از ظروف پذیرایی و ست‌های چوبی تا آثار دکوراتیوی که هرکدام ساعت‌ها با
            دقت و ظرافت ساخته شده‌اند. هر قطعه از رزان، حاصل لمس دست، توجه به جزئیات و
            احترام به زیبایی طبیعی چوب است؛ به همین دلیل هیچ دو اثری دقیقاً شبیه هم نیستند
            و هر کدام داستانی منحصربه‌فرد دارند.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="sec-head reveal"><h2>هر قطعه چگونه ساخته می‌شود؟</h2></div>
          <div className="story-steps">
            <div className="story-step reveal">
              <div className="sn">۱</div>
              <div>
                <h3>انتخاب چوب</h3>
                <p>
                  همه‌چیز از انتخاب چوب گردوی طبیعی آغاز می‌شود؛ چوبی با رگه‌هایی منحصربه‌فرد
                  که هویت هر قطعه را شکل می‌دهد. به همین دلیل، هیچ دو محصول رزان کاملاً شبیه
                  یکدیگر نیستند.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۲</div>
              <div>
                <h3>خراطی و فرم‌دهی</h3>
                <p>
                  فرم اصلی محصول با دقت خراطی می‌شود تا تناسب، استحکام و ظرافت در هر بخش به
                  بهترین شکل ایجاد شود.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۳</div>
              <div>
                <h3>منبت‌کاری با دست</h3>
                <p>
                  نقوش با دقت و حوصله روی چوب اجرا می‌شوند. هر جزئیات حاصل ساعت‌ها کار دست
                  است و همین زمان و ظرافت، به هر قطعه شخصیت و ارزش می‌بخشد.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۴</div>
              <div>
                <h3>پرداخت و پوشش نهایی</h3>
                <p>
                  پس از پرداخت و صیقل، محصول با روغن گیاهی مخصوص چوب پوشش داده می‌شود تا
                  زیبایی طبیعی چوب گردو حفظ شده و دوام آن در طول زمان افزایش یابد.
                </p>
              </div>
            </div>
            <div className="story-step reveal">
              <div className="sn">۵</div>
              <div>
                <h3>آماده برای خانه شما</h3>
                <p>
                  پس از کنترل نهایی کیفیت، هر محصول با بسته‌بندی مطمئن آماده ارسال می‌شود تا
                  با همان کیفیت و زیبایی، به خانه شما برسد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* گالری کارگاه — دو قاب دستی */}
      <section style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="sec-head reveal"><h2>مسیر خلق یک اثر</h2></div>
          <div className="craft-gallery">
            <figure className="reveal">
              <img
                src="/images/artisan-workshop.jpg"
                alt="میز کار رزان؛ مغارها، قطعات چوب و دستانِ در حال ساخت"
                loading="lazy"
              />
              <figcaption>از چوب تا اثر</figcaption>
            </figure>
            <figure className="reveal" style={{ '--rd': '.12s' }}>
              <img
                src="/images/artisan-carving.jpg"
                alt="حکاکی نزدیک؛ گل‌ها گل به گل روی تنِ چوب نقش می‌بندند"
                loading="lazy"
              />
              <figcaption>جزئیات، امضای هر قطعه</figcaption>
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
