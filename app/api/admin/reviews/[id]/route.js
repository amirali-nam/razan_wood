import { NextResponse } from 'next/server';
import { updateReview, deleteReview } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const fields = {};
    if (body.text != null) {
      const t = String(body.text).trim();
      if (!t) return NextResponse.json({ error: 'متن نظر لازم است' }, { status: 400 });
      fields.text = t;
    }
    if (body.who != null) fields.who = String(body.who).trim();
    if (body.rating != null) fields.rating = Number(body.rating);
    const ok = await updateReview(Number(id), fields);
    if (!ok) return NextResponse.json({ error: 'نظر پیدا نشد' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const ok = await deleteReview(Number(id));
    if (!ok) return NextResponse.json({ error: 'نظر پیدا نشد' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
