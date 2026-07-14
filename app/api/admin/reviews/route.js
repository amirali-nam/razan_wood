import { NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/db';

export async function GET() {
  return NextResponse.json(getReviews());
}

export async function POST(req) {
  try {
    const body = await req.json();
    const text = String(body.text || '').trim();
    const who = String(body.who || '').trim();
    const rating = Number(body.rating) || 5;
    if (!text) {
      return NextResponse.json({ error: 'متن نظر لازم است' }, { status: 400 });
    }
    const id = createReview({ text, who, rating });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
