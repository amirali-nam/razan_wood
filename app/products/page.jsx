import ProductsExplorer from '@/components/ProductsExplorer';
import { getProducts } from '@/lib/db';

export const metadata = {
  title: 'محصولات',
  description: 'همه‌ی دستسازه‌های چوبی رزان — جعبه، قندان، تابلو و نوشت‌افزار منبت‌کاری دستی.',
};
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <div className="page-head">
        <h1>دستسازه‌های رزان</h1>
        <p>جستجو کنید، دسته را انتخاب کنید و روی هر محصول بزنید تا صفحه‌ی اختصاصی‌اش را ببینید.</p>
      </div>
      <section style={{ paddingTop: 28 }}>
        <div className="container">
          <ProductsExplorer products={products} />
        </div>
      </section>
    </>
  );
}
