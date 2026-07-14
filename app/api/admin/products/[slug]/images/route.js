import { NextResponse } from 'next/server';
import { getProduct, updateProduct } from '@/lib/db';
import { removeImageFile } from '@/lib/images';

/* حذف یک عکس از محصول */
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    const p = getProduct(slug);
    if (!p) return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });
    const { image } = await req.json().catch(() => ({}));
    if (p.images.length <= 1) {
      return NextResponse.json({ error: 'محصول باید حداقل یک عکس داشته باشد' }, { status: 400 });
    }
    if (!p.images.includes(image)) {
      return NextResponse.json({ error: 'عکس پیدا نشد' }, { status: 404 });
    }
    updateProduct(slug, { images: p.images.filter((i) => i !== image) });
    await removeImageFile(image);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
