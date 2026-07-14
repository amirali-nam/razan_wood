// محافظت از پنل ادمین و APIهای مدیریتی
import { NextResponse } from 'next/server';

const COOKIE = 'razan_admin';

async function expectedToken() {
  const user = process.env.ADMIN_USER || 'admin';
  const pw = process.env.ADMIN_PASSWORD || 'razan-dev-1234';
  const data = new TextEncoder().encode('razan-salt::' + user + '::' + pw);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // صفحه و API لاگین آزادند
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;
  if (token && token === (await expectedToken())) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
