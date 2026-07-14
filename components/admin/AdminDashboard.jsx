'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { faNum } from '@/lib/site';

export default function AdminDashboard() {
  const [products, setProducts] = useState(null);
  const [msg, setMsg] = useState(null); // {text, ok}
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState([]);
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
  useEffect(() => { load(); }, []);

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

  const addImages = async (slug, files) => {
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append('images', f));
    flash('⏳ در حال آپلود عکس‌ها…');
    const j = await (await fetch('/api/admin/products/' + slug, { method: 'PUT', body: fd })).json();
    j.ok ? (flash('✓ عکس‌ها اضافه شدند'), load()) : flash(j.error, false);
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
                {p.images.map((i) => (
                  <span className="imwrap" key={i}>
                    <img src={i} alt="" loading="lazy" />
                    <button title="حذف این عکس" onClick={() => delImage(p.slug, i)}>✕</button>
                  </span>
                ))}
                <label className="addimg" title="افزودن عکس">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => addImages(p.slug, e.target.files)}
                  />
                </label>
              </div>
              <div className="body">
                <b>{p.name}</b> {p.featured && <span className="admin-badge">منتخب</span>}
                <div className="meta">
                  {p.cat} · {faNum(p.images.length)} عکس ·{' '}
                  <a href={`/products/${p.slug}/`} target="_blank" style={{ direction: 'ltr', color: 'var(--sage-dark)' }}>
                    /{p.slug}/ ↗
                  </a>
                </div>
                <div className="row">
                  <button className="btn a-danger" onClick={() => delProduct(p.slug, p.name)}>
                    حذف محصول
                  </button>
                  <button className="btn btn-ghost a-small" onClick={() => toggleFeatured(p.slug, !p.featured)}>
                    {p.featured ? 'حذف از منتخب‌ها' : 'افزودن به منتخب‌ها'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg && <div className={`admin-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
    </div>
  );
}
