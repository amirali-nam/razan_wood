import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';
import { saveImages, removeImageFile } from '@/lib/images';

export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const p = getProduct(slug);
    if (!p) return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });

    const fd = await req.formData();
    const fields = {};
    for (const key of ['name', 'cat', 'desc', 'longDesc', 'price']) {
      const v = fd.get(key);
      if (v !== null && String(v).trim() !== '') fields[key] = String(v).trim();
    }
    const feat = fd.get('featured');
    if (feat !== null) fields.featured = feat === 'true';

    const files = fd.getAll('images').filter((f) => typeof f === 'object' && f.size > 0);
    if (files.length) {
      fields.images = [...p.images, ...(await saveImages(slug, files, p.images.length + 1))];
    }
    updateProduct(slug, fields);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { slug } = await params;
    const p = deleteProduct(slug);
    if (!p) return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });
    for (const img of p.images) await removeImageFile(img);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
