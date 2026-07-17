// ============================================================
// لایه‌ی دیتابیس رزان — انتخاب خودکار بک‌اند:
//   • اگر DATABASE_URL ست باشد  → PostgreSQL (برای هاست/رانفلر)
//   • در غیر این صورت            → SQLite داخلی node:sqlite (توسعه‌ی محلی)
// همه‌ی توابع async هستند تا هر دو بک‌اند یکسان استفاده شوند.
// مسیر دیتا (فقط SQLite/آپلودها): DATA_DIR یا پوشه‌ی data کنار پروژه
// ============================================================
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import seedProducts from './data/products.json';
import seedReviews from './data/reviews.json';

const require = createRequire(import.meta.url);

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const USE_PG = !!process.env.DATABASE_URL;
const g = globalThis;

/* ============================================================
   PostgreSQL
   ============================================================ */
function getPool() {
  if (g.__razanPool) return g.__razanPool;
  const { Pool } = require('pg');
  g.__razanPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  return g.__razanPool;
}

function ensurePg() {
  if (g.__razanPgReady) return g.__razanPgReady;
  g.__razanPgReady = (async () => {
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cat TEXT NOT NULL DEFAULT 'متفرقه',
        "desc" TEXT NOT NULL DEFAULT '',
        "longDesc" TEXT NOT NULL DEFAULT '',
        price TEXT NOT NULL DEFAULT 'استعلام قیمت در دایرکت',
        featured BOOLEAN NOT NULL DEFAULT false,
        images TEXT NOT NULL DEFAULT '[]',
        created_at BIGINT NOT NULL DEFAULT extract(epoch from now())::bigint
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        who TEXT NOT NULL DEFAULT '',
        rating INTEGER NOT NULL DEFAULT 5,
        created_at BIGINT NOT NULL DEFAULT extract(epoch from now())::bigint
      );
    `);
    const { rows: pc } = await pool.query('SELECT COUNT(*)::int AS c FROM products');
    if (pc[0].c === 0) {
      for (const p of seedProducts) {
        await pool.query(
          `INSERT INTO products (slug,name,cat,"desc","longDesc",price,featured,images)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [p.slug, p.name, p.cat, p.desc, p.longDesc, p.price, !!p.featured, JSON.stringify(p.images)]
        );
      }
    }
    const { rows: rc } = await pool.query('SELECT COUNT(*)::int AS c FROM reviews');
    if (rc[0].c === 0) {
      for (const r of seedReviews) {
        await pool.query('INSERT INTO reviews (text,who,rating) VALUES ($1,$2,$3)', [
          r.text, r.who || '', Number(r.rating) || 5,
        ]);
      }
    }
    return pool;
  })();
  return g.__razanPgReady;
}

/* ============================================================
   SQLite (توسعه‌ی محلی)
   ============================================================ */
function getSqlite() {
  if (g.__razanDb) return g.__razanDb;
  const { DatabaseSync } = require('node:sqlite');
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      who TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 5,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
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
    for (const r of seedReviews) insR.run(r.text, r.who || '', Number(r.rating) || 5);
  }
  g.__razanDb = db;
  return db;
}

/* ============================================================
   نگاشت ردیف‌ها
   ============================================================ */
function rowToProduct(r) {
  return {
    slug: r.slug,
    name: r.name,
    cat: r.cat,
    desc: r.desc,
    longDesc: r.longDesc,
    price: r.price,
    featured: !!r.featured,
    images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
  };
}
function rowToReview(r) {
  return { id: Number(r.id), text: r.text, who: r.who, rating: r.rating };
}
function clampRating(r) {
  const n = Math.round(Number(r) || 5);
  return Math.min(5, Math.max(1, n));
}

/* ============================================================
   محصولات — خواندن
   ============================================================ */
export async function getProducts() {
  if (USE_PG) {
    const pool = await ensurePg();
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at ASC, slug ASC');
    return rows.map(rowToProduct);
  }
  return getSqlite()
    .prepare('SELECT * FROM products ORDER BY created_at ASC, rowid ASC')
    .all()
    .map(rowToProduct);
}
export async function getProduct(slug) {
  if (USE_PG) {
    const pool = await ensurePg();
    const { rows } = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    return rows[0] ? rowToProduct(rows[0]) : null;
  }
  const r = getSqlite().prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return r ? rowToProduct(r) : null;
}
export async function getCategories() {
  const products = await getProducts();
  return ['همه', ...new Set(products.map((p) => p.cat))];
}

/* ============================================================
   محصولات — نوشتن
   ============================================================ */
export async function createProduct(p) {
  if (USE_PG) {
    const pool = await ensurePg();
    await pool.query(
      `INSERT INTO products (slug,name,cat,"desc","longDesc",price,featured,images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [p.slug, p.name, p.cat, p.desc, p.longDesc, p.price, !!p.featured, JSON.stringify(p.images)]
    );
    return;
  }
  getSqlite()
    .prepare(
      `INSERT INTO products (slug,name,cat,desc,longDesc,price,featured,images)
       VALUES (?,?,?,?,?,?,?,?)`
    )
    .run(p.slug, p.name, p.cat, p.desc, p.longDesc, p.price, p.featured ? 1 : 0, JSON.stringify(p.images));
}
export async function updateProduct(slug, fields) {
  const cur = await getProduct(slug);
  if (!cur) return false;
  const m = { ...cur, ...fields };
  if (USE_PG) {
    const pool = await ensurePg();
    await pool.query(
      `UPDATE products SET name=$1, cat=$2, "desc"=$3, "longDesc"=$4, price=$5, featured=$6, images=$7 WHERE slug=$8`,
      [m.name, m.cat, m.desc, m.longDesc, m.price, !!m.featured, JSON.stringify(m.images), slug]
    );
    return true;
  }
  getSqlite()
    .prepare(`UPDATE products SET name=?, cat=?, desc=?, longDesc=?, price=?, featured=?, images=? WHERE slug=?`)
    .run(m.name, m.cat, m.desc, m.longDesc, m.price, m.featured ? 1 : 0, JSON.stringify(m.images), slug);
  return true;
}
export async function deleteProduct(slug) {
  const p = await getProduct(slug);
  if (!p) return null;
  if (USE_PG) {
    const pool = await ensurePg();
    await pool.query('DELETE FROM products WHERE slug = $1', [slug]);
    return p;
  }
  getSqlite().prepare('DELETE FROM products WHERE slug = ?').run(slug);
  return p;
}

/* ============================================================
   نظرات
   ============================================================ */
export async function getReviews() {
  if (USE_PG) {
    const pool = await ensurePg();
    const { rows } = await pool.query('SELECT * FROM reviews ORDER BY created_at ASC, id ASC');
    return rows.map(rowToReview);
  }
  return getSqlite()
    .prepare('SELECT * FROM reviews ORDER BY created_at ASC, id ASC')
    .all()
    .map(rowToReview);
}
export async function createReview({ text, who, rating }) {
  if (USE_PG) {
    const pool = await ensurePg();
    const { rows } = await pool.query(
      'INSERT INTO reviews (text,who,rating) VALUES ($1,$2,$3) RETURNING id',
      [String(text), String(who || ''), clampRating(rating)]
    );
    return Number(rows[0].id);
  }
  const info = getSqlite()
    .prepare('INSERT INTO reviews (text,who,rating) VALUES (?,?,?)')
    .run(String(text), String(who || ''), clampRating(rating));
  return Number(info.lastInsertRowid);
}
export async function updateReview(id, { text, who, rating }) {
  if (USE_PG) {
    const pool = await ensurePg();
    const { rows } = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    if (!rows[0]) return false;
    const cur = rows[0];
    await pool.query('UPDATE reviews SET text=$1, who=$2, rating=$3 WHERE id=$4', [
      text != null ? String(text) : cur.text,
      who != null ? String(who) : cur.who,
      rating != null ? clampRating(rating) : cur.rating,
      id,
    ]);
    return true;
  }
  const db = getSqlite();
  const cur = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!cur) return false;
  db.prepare('UPDATE reviews SET text=?, who=?, rating=? WHERE id=?').run(
    text != null ? String(text) : cur.text,
    who != null ? String(who) : cur.who,
    rating != null ? clampRating(rating) : cur.rating,
    id
  );
  return true;
}
export async function deleteReview(id) {
  if (USE_PG) {
    const pool = await ensurePg();
    const res = await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
  const info = getSqlite().prepare('DELETE FROM reviews WHERE id = ?').run(id);
  return info.changes > 0;
}
