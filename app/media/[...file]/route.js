// سرو عکس‌های آپلودشده از DATA_DIR/uploads
import path from 'path';
import { promises as fs } from 'fs';
import { UPLOADS_DIR } from '@/lib/db';

export async function GET(_req, { params }) {
  const { file } = await params;
  const name = path.basename(file.join('/')); // جلوگیری از path traversal
  try {
    const buf = await fs.readFile(path.join(UPLOADS_DIR, name));
    return new Response(buf, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('not found', { status: 404 });
  }
}
