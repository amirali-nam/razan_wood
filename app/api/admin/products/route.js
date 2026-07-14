import { NextResponse } from 'next/server';
import { getProducts, getProduct, createProduct } from '@/lib/db';
import { saveImages } from '@/lib/images';

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req) {
  try {
    const fd = await req.formData();
    const slug = String(fd.get('slug') || '').trim();
    const name = String(fd.get('name') || '').trim();
    if (!name) return NextResponse.json({ error: 'نام محصول لازم است' }, { status: 400 });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { error: 'slug فقط حروف انگلیسی کوچک، عدد و خط تیره (مثل walnut-tray)' },
        { status: 400 }
      );
    }
    if (getProduct(slug)) {
      return NextResponse.json({ error: 'این slug قبلاً استفاده شده' }, { status: 400 });
    }
    const files = fd.getAll('images').filter((f) => typeof f === 'object' && f.size > 0);
    if (!files.length) {
      return NextResponse.json({ error: 'حداقل یک عکس لازم است' }, { status: 400 });
    }
    const images = await saveImages(slug, files);
    createProduct({
      slug,
      name,
      cat: String(fd.get('cat') || 'متفرقه').trim() || 'متفرقه',
      desc: String(fd.get('desc') || '').trim(),
      longDesc: String(fd.get('longDesc') || fd.get('desc') || '').trim(),
      price: String(fd.get('price') || '').trim() || 'استعلام قیمت در دایرکت',
      featured: fd.get('featured') === 'true',
      images,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
