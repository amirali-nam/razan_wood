'use client';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';

/* هایلایت بخش پیداشده در متن ساجسشن */
function Hi({ text, q }) {
  const i = text.indexOf(q);
  if (i === -1 || !q) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/* جستجوی پیشرفته: تایپ کنید، خودش پیشنهاد می‌دهد */
export default function ProductsExplorer({ products }) {
  const PRODUCTS = products;
  const CATEGORIES = useMemo(() => ['همه', ...new Set(products.map((p) => p.cat))], [products]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('همه');
  const [sort, setSort] = useState('default');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1); // آیتم انتخاب‌شده با کیبورد
  const router = useRouter();
  const blurTimer = useRef(null);

  const t = q.trim();

  /* ساجسشن‌ها: دسته‌ها + محصولات */
  const suggestions = useMemo(() => {
    if (!t) return [];
    const cats = CATEGORIES.filter((c) => c !== 'همه' && c.includes(t)).map((c) => ({
      type: 'cat',
      key: 'cat-' + c,
      label: c,
    }));
    const prods = PRODUCTS.filter(
      (p) => p.name.includes(t) || p.desc.includes(t) || p.cat.includes(t)
    )
      .slice(0, 6)
      .map((p) => ({
        type: 'product',
        key: p.slug,
        label: p.name,
        img: p.images[0],
        cat: p.cat,
        slug: p.slug,
      }));
    return [...cats, ...prods];
  }, [t]);

  const pick = (s) => {
    if (!s) return;
    if (s.type === 'cat') {
      setCat(s.label);
      setQ('');
    } else {
      router.push(`/products/${s.slug}/`);
    }
    setOpen(false);
    setHi(-1);
  };

  const onKey = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((h) => (h + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && hi >= 0) {
      e.preventDefault();
      pick(suggestions[hi]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHi(-1);
    }
  };

  /* لیست نهایی */
  const list = useMemo(() => {
    let l = [...PRODUCTS];
    if (cat !== 'همه') l = l.filter((p) => p.cat === cat);
    if (t) l = l.filter((p) => p.name.includes(t) || p.desc.includes(t) || p.cat.includes(t));
    if (sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    if (sort === 'photos') l.sort((a, b) => b.images.length - a.images.length);
    return l;
  }, [t, cat, sort]);

  return (
    <>
      <div className="explorer-bar">
        <div className="search-wrap">
          <div className="search-box">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="جستجو بین دستسازه‌ها…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
                setHi(-1);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 180);
              }}
              onKeyDown={onKey}
              aria-label="جستجو"
              aria-expanded={open && suggestions.length > 0}
              role="combobox"
              autoComplete="off"
            />
            {q && (
              <button className="clear-q" onClick={() => { setQ(''); setHi(-1); }} aria-label="پاک کردن">
                ✕
              </button>
            )}
          </div>

          {open && suggestions.length > 0 && (
            <div className="suggest-box" role="listbox">
              {suggestions.map((s, i) => (
                <button
                  key={s.key}
                  className={`suggest-item ${i === hi ? 'hi' : ''}`}
                  role="option"
                  aria-selected={i === hi}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  onMouseEnter={() => setHi(i)}
                >
                  {s.type === 'cat' ? (
                    <>
                      <span className="s-icon">🏷</span>
                      <span className="s-main">
                        دسته‌ی <b><Hi text={s.label} q={t} /></b>
                      </span>
                      <span className="s-side">فیلتر</span>
                    </>
                  ) : (
                    <>
                      <img className="s-thumb" src={s.img} alt="" />
                      <span className="s-main">
                        <Hi text={s.label} q={t} />
                        <small>{s.cat}</small>
                      </span>
                      <span className="s-side">دیدن ‹</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="مرتب‌سازی">
          <option value="default">مرتب‌سازی: پیش‌فرض</option>
          <option value="name">بر اساس نام</option>
          <option value="photos">بیشترین عکس</option>
        </select>
      </div>

      <div className="filters">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="no-result">چیزی پیدا نشد — عبارت دیگری امتحان کنید 🌱</p>
      ) : (
        <div className="grid">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={(i % 4) * 0.06} />
          ))}
        </div>
      )}
    </>
  );
}
