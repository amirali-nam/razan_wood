// ============================================================
// تنظیمات کلی سایت — لینک‌ها و متن‌های ثابت
// ============================================================
export const SITE = {
  name: 'رزان | دستسازه‌های چوبی',
  nameEn: 'Razan Handicraft Woods',
  tagline: 'رنگ زندگی بر تن چوب',
  url: 'https://razanwood.ir',
  instagram: 'https://www.instagram.com/razan.wood',
  igDirect: 'https://ig.me/m/razan.wood',
  waNumber: '989135380500',
  phoneDisplay: '۰۹۱۳۵۳۸۰۵۰۰',
  developer: { name: 'امیرعلی', github: 'https://github.com/amirali-nam' },
};

export function waLink(message) {
  return `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(message)}`;
}

export function faNum(n) {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
}
