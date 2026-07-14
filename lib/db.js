// ============================================================
// دیتابیس SQLite — انتخاب خودکار درایور بر اساس نسخه‌ی Node:
//   • Node 22+ (محیط توسعه): ماژول داخلی node:sqlite — بدون کامپایل
//   • Node 20 (هاست پارس‌پک): پکیج better-sqlite3 (نسخه‌ی از پیش‌ساخته)
// هر دو API یکسان دارند، پس بقیه‌ی کد بدون تغییر کار می‌کند.
// مسیر دیتا: متغیر محیطی DATA_DIR یا پوشه‌ی data کنار پروژه
// ============================================================
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import seedProducts from './data/products.json';
import seedReviews from './data/reviews.json';

const require = createRequire(import.meta.url);

function openDatabase(file) {
  // اول ماژول داخلیِ Node را امتحان کن (Node 22+ ، بدون وابستگی نیتیو)
  try {
    const { DatabaseSync } = require('node:sqlite');
    return new DatabaseSync(file);
  } catch {
    // در نبود آن (مثلاً Node 20 روی هاست) به better-sqlite3 برگرد
    const Database = require('better-sqlite3');
    return new Database(file);
  }
}

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// singleton با باز شدن تنبل (lazy) — موقع build باز نمی‌شود و
// در dev با hot reload هم دوباره ساخته نمی‌شود
const g = globalThis;
function getDb() {
  if (g.__razanDb) return g.__razanDb;
  const db = openDatabase(path.join(DATA_DIR, 'razan.db'));
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      who TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 5,
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
  const rc = db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c;
  if (rc === 0) {
    const insR = db.prepare('INSERT INTO reviews (text,who,rating) VALUES (?,?,?)');
    for (const r of seedReviews) {
      insR.run(r.text, r.who || '', Number(r.rating) || 5);
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

/* ---------- نظرات ---------- */
function rowToReview(r) {
  return { id: r.id, text: r.text, who: r.who, rating: r.rating };
}
export function getReviews() {
  return getDb()
    .prepare('SELECT * FROM reviews ORDER BY created_at ASC, id ASC')
    .all()
    .map(rowToReview);
}
export function createReview({ text, who, rating }) {
  const info = getDb()
    .prepare('INSERT INTO reviews (text,who,rating) VALUES (?,?,?)')
    .run(String(text), String(who || ''), clampRating(rating));
  return Number(info.lastInsertRowid);
}
export function updateReview(id, { text, who, rating }) {
  const cur = getDb().prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!cur) return false;
  getDb()
    .prepare('UPDATE reviews SET text=?, who=?, rating=? WHERE id=?')
    .run(
      text != null ? String(text) : cur.text,
      who != null ? String(who) : cur.who,
      rating != null ? clampRating(rating) : cur.rating,
      id
    );
  return true;
}
export function deleteReview(id) {
  const info = getDb().prepare('DELETE FROM reviews WHERE id = ?').run(id);
  return info.changes > 0;
}
function clampRating(r) {
  const n = Math.round(Number(r) || 5);
  return Math.min(5, Math.max(1, n));
}
