import GalleryGrid from '@/components/GalleryGrid';
import { getProducts } from '@/lib/db';

export const metadata = {
  title: 'گالری',
  description: 'گالری کامل آثار رزان — همه‌ی عکس‌های دستسازه‌های چوبی منبت‌کاری‌شده.',
};
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const products = await getProducts();
  return (
    <>
      <div className="page-head">
        <h1>گالری آثار</h1>
        <p>همه‌ی کارها یکجا — روی هر عکس بزنید تا بزرگ ببینید.</p>
      </div>
      <section style={{ paddingTop: 28 }}>
        <div className="container">
          <GalleryGrid products={products} />
        </div>
      </section>
    </>
  );
}
