import { NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';
import { saveImages, removeImageFile } from '@/lib/images';

export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const p = await getProduct(slug);
    if (!p) return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });

    const fd = await req.formData();
    const fields = {};
    for (const key of ['name', 'cat', 'desc', 'longDesc', 'price']) {
      const v = fd.get(key);
      if (v !== null && String(v).trim() !== '') fields[key] = String(v).trim();
    }
    const feat = fd.get('featured');
    if (feat !== null) fields.featured = feat === 'true';

    const replace = fd.get('replaceImages') === 'true';
    const files = fd.getAll('images').filter((f) => typeof f === 'object' && f.size > 0);
    if (files.length) {
      if (replace) {
        // عکس‌های قدیمی (از جمله شکسته‌ها) پاک و فقط عکس‌های جدید جایگزین می‌شوند
        const newImgs = await saveImages(slug, files, 1);
        for (const old of p.images) await removeImageFile(old);
        fields.images = newImgs;
      } else {
        fields.images = [...p.images, ...(await saveImages(slug, files, p.images.length + 1))];
      }
    }
    await updateProduct(slug, fields);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { slug } = await params;
    const p = await deleteProduct(slug);
    if (!p) return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });
    for (const img of p.images) await removeImageFile(img);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
