import { getProducts } from '@/lib/db';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const pages = ['', 'products/', 'gallery/', 'custom-order/', 'about/'].map((p) => ({
    url: `${SITE.url}/${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }));
  const products = (await getProducts()).map((p) => ({
    url: `${SITE.url}/products/${p.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...pages, ...products];
}
