'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { faNum } from '@/lib/site';

export default function AdminDashboard() {
  const [products, setProducts] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [rForm, setRForm] = useState({ text: '', who: '', rating: 5 });
  const [rBusy, setRBusy] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDraft, setEditDraft] = useState({ text: '', who: '', rating: 5 });
  const [msg, setMsg] = useState(null); // {text, ok}
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [pEdit, setPEdit] = useState(null); // slug محصولی که در حال ویرایش است
  const [pDraft, setPDraft] = useState({ name: '', cat: '', price: '', desc: '', longDesc: '' });
  const formRef = useRef(null);
  const router = useRouter();

  const flash = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 4500);
  };

  const load = async () => {
    const r = await fetch('/api/admin/products');
    if (r.status === 401) return router.push('/admin/login');
    setProducts(await r.json());
  };
  const loadReviews = async () => {
    const r = await fetch('/api/admin/reviews');
    if (r.status === 401) return router.push('/admin/login');
    setReviews(await r.json());
  };
  useEffect(() => { load(); loadReviews(); }, []);

  const addReview = async (e) => {
    e.preventDefault();
    if (!rForm.text.trim()) return flash('متن نظر لازم است', false);
    setRBusy(true);
    const j = await (
      await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rForm),
      })
    ).json();
    setRBusy(false);
    if (j.ok) {
      flash('✓ نظر اضافه شد و روی سایت است!');
      setRForm({ text: '', who: '', rating: 5 });
      loadReviews();
    } else flash(j.error || 'خطا', false);
  };

  const saveReview = async (id) => {
    if (!editDraft.text.trim()) return flash('متن نظر لازم است', false);
    const j = await (
      await fetch('/api/admin/reviews/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      })
    ).json();
    if (j.ok) {
      flash('✓ نظر ویرایش شد');
      setEditId(null);
      loadReviews();
    } else flash(j.error || 'خطا', false);
  };

  const delReview = async (id) => {
    if (!confirm('این نظر حذف شود؟')) return;
    const j = await (await fetch('/api/admin/reviews/' + id, { method: 'DELETE' })).json();
    j.ok ? (flash('✓ نظر حذف شد'), loadReviews()) : flash(j.error, false);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    fd.set('featured', formRef.current.featured.checked ? 'true' : 'false');
    setBusy(true);
    const r = await fetch('/api/admin/products', { method: 'POST', body: fd });
    const j = await r.json();
    setBusy(false);
    if (j.ok) {
      flash('✓ محصول اضافه شد و همین حالا روی سایت است!');
      formRef.current.reset();
      setPreviews([]);
      load();
    } else flash(j.error || 'خطا', false);
  };

  const delProduct = async (slug, name) => {
    if (!confirm(`«${name}» و عکس‌هایش حذف شود؟`)) return;
    const j = await (await fetch('/api/admin/products/' + slug, { method: 'DELETE' })).json();
    j.ok ? (flash('✓ حذف شد'), load()) : flash(j.error, false);
  };

  const delImage = async (slug, image) => {
    if (!confirm('این عکس حذف شود؟')) return;
    const j = await (
      await fetch(`/api/admin/products/${slug}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
    ).json();
    j.ok ? (flash('✓ عکس حذف شد'), load()) : flash(j.error, false);
  };

  const toggleFeatured = async (slug, val) => {
    const fd = new FormData();
    fd.set('featured', val ? 'true' : 'false');
    const j = await (await fetch('/api/admin/products/' + slug, { method: 'PUT', body: fd })).json();
    j.ok ? (flash('✓ ذخیره شد'), load()) : flash(j.error, false);
  };

  const addImages = async (slug, files, replace = false) => {
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append('images', f));
    if (replace) fd.set('replaceImages', 'true');
    flash(replace ? '⏳ در حال جایگزینی عکس‌ها…' : '⏳ در حال آپلود عکس‌ها…');
    const j = await (await fetch('/api/admin/products/' + slug, { method: 'PUT', body: fd })).json();
    j.ok
      ? (flash(replace ? '✓ عکس‌ها جایگزین شدند' : '✓ عکس‌ها اضافه شدند'), load())
      : flash(j.error, false);
  };

  const startEditProduct = (p) => {
    setPEdit(p.slug);
    setPDraft({ name: p.name, cat: p.cat, price: p.price, desc: p.desc, longDesc: p.longDesc || '' });
  };

  const saveProduct = async (slug) => {
    if (!pDraft.name.trim() || !pDraft.desc.trim() || !pDraft.cat.trim()) {
      return flash('نام، دسته و توضیح کوتاه لازم است', false);
    }
    const fd = new FormData();
    fd.set('name', pDraft.name);
    fd.set('cat', pDraft.cat);
    fd.set('price', pDraft.price);
    fd.set('desc', pDraft.desc);
    fd.set('longDesc', pDraft.longDesc);
    const j = await (await fetch('/api/admin/products/' + slug, { method: 'PUT', body: fd })).json();
    if (j.ok) {
      flash('✓ متن محصول ویرایش شد');
      setPEdit(null);
      load();
    } else flash(j.error || 'خطا', false);
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <h1>🌱 پنل مدیریت رزان</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="btn btn-ghost" href="/" target="_blank" style={{ padding: '8px 18px', fontSize: '.85rem' }}>
            دیدن سایت ↗
          </a>
          <button className="btn btn-ghost" onClick={logout} style={{ padding: '8px 18px', fontSize: '.85rem' }}>
            خروج
          </button>
        </div>
      </div>

      <h2 className="admin-h2">➕ افزودن محصول جدید</h2>
      <form ref={formRef} onSubmit={addProduct} className="admin-form">
        <div className="grid2">
          <div>
            <label>نام محصول *</label>
            <input name="name" required placeholder="مثلاً: سینی گردو منبت" />
          </div>
          <div>
            <label>
              شناسه انگلیسی (slug) * <small>آدرس صفحه می‌شود — حروف کوچک و خط تیره</small>
            </label>
            <input
              name="slug"
              required
              placeholder="walnut-tray"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>
        <div className="grid2">
          <div>
            <label>دسته‌بندی *</label>
            <input name="cat" required list="cats" placeholder="مثلاً: پذیرایی" />
            <datalist id="cats">
              {[...new Set((products || []).map((p) => p.cat))].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label>قیمت</label>
            <input name="price" defaultValue="استعلام قیمت در دایرکت" />
          </div>
        </div>
        <div>
          <label>توضیح کوتاه * <small>روی کارت محصول</small></label>
          <input name="desc" required placeholder="یک جمله درباره‌ی محصول" />
        </div>
        <div>
          <label>توضیح کامل <small>در صفحه‌ی اختصاصی محصول</small></label>
          <textarea name="longDesc" placeholder="چند جمله درباره‌ی ساخت، کاربرد و حس محصول…" />
        </div>
        <label className="admin-check">
          <input type="checkbox" name="featured" /> نمایش در «منتخب‌های» صفحه‌ی اول
        </label>
        <div>
          <label>عکس‌ها * <small>چندتا با هم — خودکار فشرده می‌شوند</small></label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            required
            onChange={(e) => setPreviews([...e.target.files].map((f) => URL.createObjectURL(f)))}
          />
          <div className="admin-preview">
            {previews.map((src) => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        </div>
        <div>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'در حال ذخیره…' : 'ذخیره — بلافاصله روی سایت می‌رود'}
          </button>
        </div>
      </form>

      <h2 className="admin-h2">
        📦 محصولات {products && <small>({faNum(products.length)} محصول)</small>}
      </h2>
      {!products ? (
        <p>در حال بارگذاری…</p>
      ) : (
        <div className="admin-plist">
          {products.map((p) => (
            <div className="admin-pcard" key={p.slug}>
              <div className="imgs">
                {p.images.length === 0 && (
                  <span className="no-img">هنوز عکسی ندارد — از دکمه‌ی «آپلود عکس» اضافه کنید</span>
                )}
                {p.images.map((i) => (
                  <span className="imwrap" key={i}>
                    <img src={i} alt="" loading="lazy" />
                    <button title="حذف این عکس" onClick={() => delImage(p.slug, i)}>✕</button>
                  </span>
                ))}
              </div>
              <div className="body">
                {pEdit === p.slug ? (
                  <div className="admin-form" style={{ gap: 8 }}>
                    <input
                      value={pDraft.name}
                      onChange={(e) => setPDraft({ ...pDraft, name: e.target.value })}
                      placeholder="نام محصول"
                    />
                    <div className="grid2">
                      <input
                        value={pDraft.cat}
                        onChange={(e) => setPDraft({ ...pDraft, cat: e.target.value })}
                        placeholder="دسته‌بندی"
                      />
                      <input
                        value={pDraft.price}
                        onChange={(e) => setPDraft({ ...pDraft, price: e.target.value })}
                        placeholder="قیمت"
                      />
                    </div>
                    <input
                      value={pDraft.desc}
                      onChange={(e) => setPDraft({ ...pDraft, desc: e.target.value })}
                      placeholder="توضیح کوتاه (روی کارت)"
                    />
                    <textarea
                      value={pDraft.longDesc}
                      onChange={(e) => setPDraft({ ...pDraft, longDesc: e.target.value })}
                      placeholder="توضیح کامل (صفحه‌ی محصول)"
                    />
                    <div className="row">
                      <button className="btn btn-primary a-small" onClick={() => saveProduct(p.slug)}>
                        ذخیره
                      </button>
                      <button className="btn btn-ghost a-small" onClick={() => setPEdit(null)}>
                        انصراف
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <b>{p.name}</b> {p.featured && <span className="admin-badge">منتخب</span>}
                    <div className="meta">
                      {p.cat} · {faNum(p.images.length)} عکس ·{' '}
                      <a href={`/products/${p.slug}/`} target="_blank" style={{ direction: 'ltr', color: 'var(--sage-dark)' }}>
                        /{p.slug}/ ↗
                      </a>
                    </div>
                    <div className="row">
                      <label className="btn btn-primary a-small" style={{ cursor: 'pointer' }}>
                        🔁 جایگزینی عکس‌ها
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => {
                            if (
                              e.target.files.length &&
                              confirm('همه‌ی عکس‌های فعلی این محصول حذف و با عکس‌های جدید جایگزین شوند؟')
                            ) {
                              addImages(p.slug, e.target.files, true);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <label className="btn btn-ghost a-small" style={{ cursor: 'pointer' }}>
                        ➕ افزودن عکس
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => {
                            addImages(p.slug, e.target.files);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <button className="btn btn-ghost a-small" onClick={() => startEditProduct(p)}>
                        ویرایش متن
                      </button>
                      <button className="btn btn-ghost a-small" onClick={() => toggleFeatured(p.slug, !p.featured)}>
                        {p.featured ? 'حذف از منتخب‌ها' : 'افزودن به منتخب‌ها'}
                      </button>
                      <button className="btn a-danger" onClick={() => delProduct(p.slug, p.name)}>
                        حذف محصول
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="admin-h2">➕ افزودن نظر مشتری</h2>
      <form onSubmit={addReview} className="admin-form">
        <div>
          <label>متن نظر *</label>
          <textarea
            value={rForm.text}
            onChange={(e) => setRForm({ ...rForm, text: e.target.value })}
            placeholder="مثلاً: جعبه‌ای که گرفتم از عکس هم قشنگ‌تر بود…"
            required
          />
        </div>
        <div className="grid2">
          <div>
            <label>نویسنده <small>مثلاً: مشتری از تهران</small></label>
            <input
              value={rForm.who}
              onChange={(e) => setRForm({ ...rForm, who: e.target.value })}
              placeholder="مشتری از تهران"
            />
          </div>
          <div>
            <label>امتیاز (ستاره)</label>
            <StarPicker value={rForm.rating} onChange={(n) => setRForm({ ...rForm, rating: n })} />
          </div>
        </div>
        <div>
          <button className="btn btn-primary" disabled={rBusy}>
            {rBusy ? 'در حال ذخیره…' : 'افزودن نظر'}
          </button>
        </div>
      </form>

      <h2 className="admin-h2">
        ⭐ نظرات {reviews && <small>({faNum(reviews.length)} نظر)</small>}
      </h2>
      {!reviews ? (
        <p>در حال بارگذاری…</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: '#7d6c5a' }}>هنوز نظری ثبت نشده — از فرم بالا اضافه کنید.</p>
      ) : (
        <div className="admin-rlist">
          {reviews.map((r) => (
            <div className="admin-rcard" key={r.id}>
              {editId === r.id ? (
                <div className="admin-form" style={{ gap: 10 }}>
                  <textarea
                    value={editDraft.text}
                    onChange={(e) => setEditDraft({ ...editDraft, text: e.target.value })}
                  />
                  <div className="grid2">
                    <input
                      value={editDraft.who}
                      onChange={(e) => setEditDraft({ ...editDraft, who: e.target.value })}
                      placeholder="نویسنده"
                    />
                    <StarPicker
                      value={editDraft.rating}
                      onChange={(n) => setEditDraft({ ...editDraft, rating: n })}
                    />
                  </div>
                  <div className="row">
                    <button className="btn btn-primary a-small" onClick={() => saveReview(r.id)}>
                      ذخیره
                    </button>
                    <button className="btn btn-ghost a-small" onClick={() => setEditId(null)}>
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stars-static" aria-label={`${r.rating} ستاره`}>
                    <span className="on">{'★'.repeat(Math.min(5, Math.max(1, r.rating)))}</span>
                    <span className="off">{'★'.repeat(5 - Math.min(5, Math.max(1, r.rating)))}</span>
                  </div>
                  <q>{r.text}</q>
                  {r.who && <div className="meta">— {r.who}</div>}
                  <div className="row">
                    <button
                      className="btn btn-ghost a-small"
                      onClick={() => {
                        setEditId(r.id);
                        setEditDraft({ text: r.text, who: r.who || '', rating: r.rating });
                      }}
                    >
                      ویرایش
                    </button>
                    <button className="btn a-danger" onClick={() => delReview(r.id)}>
                      حذف
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {msg && <div className={`admin-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="امتیاز">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? 'on' : ''}
          aria-label={`${n} ستاره`}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
