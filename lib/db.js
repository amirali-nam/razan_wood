// ============================================================
// دیتابیس SQLite — با ماژول داخلی node:sqlite (نیاز: Node 22+)
// بدون هیچ وابستگی نیتیو؛ روی هر هاست Node بالا می‌آید.
// مسیر دیتا: متغیر محیطی DATA_DIR یا پوشه‌ی data کنار پروژه
// بار اول، محصولات از lib/data/products.json داخل دیتابیس seed می‌شوند
// ============================================================
import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import seedProducts from './data/products.json';

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// singleton با باز شدن تنبل (lazy) — موقع build باز نمی‌شود و
// در dev با hot reload هم دوباره ساخته نمی‌شود
const g = globalThis;
function getDb() {
  if (g.__razanDb) return g.__razanDb;
  const db = new DatabaseSync(path.join(DATA_DIR, 'razan.db'));
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cat TEXT NOT NULL DEFAULT 'متفرقه',
      desc TEXT NOT NULL DEFAULT '',
      longDesc TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT 'استعلام قیمت در دایرکت',
      featured INTEGER NOT NULL DEFAULT 0,
      images TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
  // seed اولیه
  const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  if (count === 0) {
    const ins = db.prepare(
      `INSERT INTO products (slug,name,cat,desc,longDesc,price,featured,images)
       VALUES (?,?,?,?,?,?,?,?)`
    );
    for (const p of seedProducts) {
      ins.run(p.slug, p.name, p.cat, p.desc, p.longDesc, p.price, p.featured ? 1 : 0, JSON.stringify(p.images));
    }
  }
  g.__razanDb = db;
  return db;
}

function rowToProduct(r) {
  return {
    slug: r.slug,
    name: r.name,
    cat: r.cat,
    desc: r.desc,
    longDesc: r.longDesc,
    price: r.price,
    featured: !!r.featured,
    images: JSON.parse(r.images),
  };
}

/* ---------- خواندن ---------- */
export function getProducts() {
  return getDb().prepare('SELECT * FROM products ORDER BY created_at ASC, rowid ASC').all().map(rowToProduct);
}
export function getProduct(slug) {
  const r = getDb().prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return r ? rowToProduct(r) : null;
}
export function getCategories() {
  return ['همه', ...new Set(getProducts().map((p) => p.cat))];
}

/* ---------- نوشتن ---------- */
export function createProduct(p) {
  getDb().prepare(
    `INSERT INTO products (slug,name,cat,desc,longDesc,price,featured,images)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(p.slug, p.name, p.cat, p.desc, p.longDesc, p.price, p.featured ? 1 : 0, JSON.stringify(p.images));
}
export function updateProduct(slug, fields) {
  const p = getProduct(slug);
  if (!p) return false;
  const m = { ...p, ...fields };
  getDb().prepare(
    `UPDATE products SET name=?, cat=?, desc=?, longDesc=?, price=?, featured=?, images=? WHERE slug=?`
  ).run(m.name, m.cat, m.desc, m.longDesc, m.price, m.featured ? 1 : 0, JSON.stringify(m.images), slug);
  return true;
}
export function deleteProduct(slug) {
  const p = getProduct(slug);
  if (!p) return null;
  getDb().prepare('DELETE FROM products WHERE slug = ?').run(slug);
  return p;
}
