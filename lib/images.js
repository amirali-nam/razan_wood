// ذخیره‌ی عکس‌های آپلودی: ریسایز + فشرده‌سازی، در DATA_DIR/uploads
// آدرس نهایی: /media/<name>.jpg
import path from 'path';
import { promises as fs } from 'fs';
import { UPLOADS_DIR, DATA_DIR } from './db';

let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('⚠ sharp در دسترس نیست — عکس‌ها بدون ریسایز ذخیره می‌شوند');
}

export async function saveImages(slug, files, startIndex = 1) {
  const saved = [];
  let n = startIndex;
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    const name = `${slug}-${Date.now()}-${n}.jpg`;
    const dest = path.join(UPLOADS_DIR, name);
    if (sharp) {
      await sharp(buf)
        .rotate()
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(dest);
    } else {
      await fs.writeFile(dest, buf);
    }
    saved.push(`/media/${name}`);
    n++;
  }
  return saved;
}

export async function removeImageFile(imagePath) {
  // فقط فایل‌های آپلودی (media) حذف می‌شوند؛ عکس‌های اولیه در public می‌مانند
  if (!imagePath?.startsWith('/media/')) return;
  const name = path.basename(imagePath);
  await fs.unlink(path.join(UPLOADS_DIR, name)).catch(() => {});
}

export { DATA_DIR };
