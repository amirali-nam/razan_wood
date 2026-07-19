'use client';
import { useMemo, useState } from 'react';
import { SITE, waLink } from '@/lib/site';

const TYPES = [
  'ظروف پذیرایی خاص',
  'سینی پذیرایی',
  'قندان / ظرف پذیرایی',
  'تابلوی نقش‌برجسته',
  'نوشت‌افزار (خودکار/اتود)',
  'آینه / دکور',
  'چیز دیگری در ذهن دارم',
];

/* فرم سفارش سفارشی: خروجی‌اش یک پیام آماده برای واتساپ/دایرکت است */
export default function CustomOrderForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState(TYPES[0]);
  const [design, setDesign] = useState('');
  const [size, setSize] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const message = useMemo(() => {
    let m = `سلام 🌱 از سایت رزان برای محصول سفارشی پیام می‌دم.\n`;
    if (name.trim()) m += `👤 نام: ${name.trim()}\n`;
    m += `🪵 نوع محصول: ${type}\n`;
    if (design.trim()) m += `✿ طرح/نقش دلخواه: ${design.trim()}\n`;
    if (size.trim()) m += `📐 ابعاد تقریبی: ${size.trim()}\n`;
    if (notes.trim()) m += `📝 توضیحات: ${notes.trim()}`;
    return m;
  }, [name, type, design, size, notes]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* مرورگرهای قدیمی */
    }
  };

  return (
    <div className="order-form reveal">
      <div>
        <label htmlFor="of-name">نام شما (اختیاری)</label>
        <input id="of-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: سارا" />
      </div>
      <div>
        <label htmlFor="of-type">چه محصولی می‌خواهید؟</label>
        <select id="of-type" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="of-design">طرح یا نقش دلخواه</label>
        <input id="of-design" value={design} onChange={(e) => setDesign(e.target.value)} placeholder="مثلاً: گل آفتابگردان، ترکیب گل‌های متفاوت و…" />
      </div>
      <div>
        <label htmlFor="of-size">ابعاد تقریبی (اختیاری)</label>
        <input id="of-size" value={size} onChange={(e) => setSize(e.target.value)} placeholder="مثلاً: سینی پذیرایی قطر ۳۰ سانتی‌متر" />
      </div>
      <div>
        <label htmlFor="of-notes">توضیحات بیشتر</label>
        <textarea id="of-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="هر چیزی که کمک کند تصورتان را بهتر بفهمیم — مناسبت، رنگ چوب، بودجه‌ی حدودی…" />
      </div>

      <div>
        <label>پیش‌نمایش پیام شما</label>
        <div className="msg-preview">{message}</div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="btn btn-wa" href={waLink(message)} target="_blank" rel="noopener">
          ارسال در واتساپ
        </a>
        <button className="btn btn-primary" type="button" onClick={copy}>
          کپی پیام برای دایرکت
        </button>
        <a className="btn btn-ghost" href={SITE.igDirect} target="_blank" rel="noopener">
          باز کردن دایرکت
        </a>
        {copied && <span className="copy-ok">✓ کپی شد! حالا در دایرکت پیست کنید</span>}
      </div>
    </div>
  );
}
