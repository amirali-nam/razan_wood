import { NextResponse } from 'next/server';
import { checkCredentials, makeToken, COOKIE_NAME } from '@/lib/auth';

/* محدودیت تلاش برای ورود: حداکثر ۵ تلاش ناموفق در ۱۵ دقیقه از هر IP */
const attempts = new Map(); // ip → { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimited(ip) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return 0;
  }
  if (rec.count >= MAX_ATTEMPTS) {
    return Math.max(1, Math.ceil((rec.resetAt - now) / 60000)); // دقیقه‌ی باقی‌مانده
  }
  return 0;
}
function recordFail(ip) {
  const rec = attempts.get(ip);
  if (rec) rec.count++;
  // پاکسازی نقشه که بی‌نهایت بزرگ نشود
  if (attempts.size > 10000) attempts.clear();
}

export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const waitMin = rateLimited(ip);
  if (waitMin) {
    return NextResponse.json(
      { error: `🔒 به‌خاطر تلاش‌های زیاد ناموفق، ورود موقتاً قفل شده — ${waitMin} دقیقه دیگر دوباره امتحان کنید`, locked: true },
      { status: 429 }
    );
  }
  const { username, password } = await req.json().catch(() => ({}));
  if (!checkCredentials(username, password)) {
    recordFail(ip);
    return NextResponse.json({ error: 'نام کاربری یا رمز اشتباه است' }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return res;
}

/* خروج */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
