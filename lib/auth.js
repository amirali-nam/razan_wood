// ============================================================
// احراز هویت پنل ادمین — نام کاربری + رمز عبور
// از متغیرهای محیطی ADMIN_USER و ADMIN_PASSWORD خوانده می‌شوند
// ============================================================
import { createHash, timingSafeEqual } from 'crypto';

export const COOKIE_NAME = 'razan_admin';

export function getUser() {
  return process.env.ADMIN_USER || 'admin';
}

export function getPassword() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    console.warn('⚠ ADMIN_PASSWORD تنظیم نشده — رمز پیش‌فرض ناامن فعال است (فقط برای توسعه)');
    return 'razan-dev-1234';
  }
  return p;
}

function safeEq(a, b) {
  const ba = Buffer.from(String(a ?? ''));
  const bb = Buffer.from(String(b ?? ''));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/* توکن = هش (یوزر + رمز)؛ در کوکی httpOnly ذخیره می‌شود */
export function makeToken() {
  return createHash('sha256')
    .update('razan-salt::' + getUser() + '::' + getPassword())
    .digest('hex');
}

export function checkCredentials(username, password) {
  return safeEq(username, getUser()) && safeEq(password, getPassword());
}

export function checkToken(token) {
  return safeEq(token, makeToken());
}

/* برای route handler ها */
export function isAuthed(request) {
  return checkToken(request.cookies.get(COOKIE_NAME)?.value);
}
