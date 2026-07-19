import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/db';
import { SITE, waLink } from '@/lib/site';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.desc,
    openGraph: { title: `${p.name} | رزان`, description: p.desc, images: [p.images[0]] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const related = (await getProducts())
    .filter((x) => x.cat === p.cat && x.slug !== p.slug)
    .slice(0, 3);

  return (
    <>
      <div className="container product-page">
        <ProductGallery product={p} />
        <div className="pinfo">
          <span className="crumb">
            <Link href="/products/">محصولات</Link> ‹ {p.cat}
          </span>
          <h1>{p.name}</h1>
          <span className="cat-tag">دسته: {p.cat}</span>
          <p className="long">{p.longDesc}</p>
          <div className="price">{p.price}</div>
          <div className="pactions">
            <a className="btn btn-primary" href={SITE.igDirect} target="_blank" rel="noopener">
              سفارش در دایرکت
            </a>
            <a
              className="btn btn-wa"
              href={waLink(`سلام 🌱 برای سفارش «${p.name}» از سایت رزان پیام می‌دم.`)}
              target="_blank"
              rel="noopener"
            >
              سفارش در واتساپ
            </a>
          </div>
          <div className="order-note">
            💡 این محصول با دست ساخته می‌شود؛ اگر سایز یا طرح متفاوتی می‌خواهید، از صفحه‌ی{' '}
            <Link href="/custom-order/" style={{ color: 'var(--sage-dark)', fontWeight: 700 }}>
              محصول سفارشی
            </Link>{' '}
            درخواست بدهید.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <div className="container">
            <div className="sec-head reveal">
              <h2>کارهای مشابه</h2>
            </div>
            <div className="grid">
              {related.map((r, i) => (
                <ProductCard key={r.slug} product={r} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
