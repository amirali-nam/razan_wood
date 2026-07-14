/** @type {import('next').NextConfig} */
const nextConfig = {
  // خروجی standalone — مناسب هاست Node (لیارا، پارس‌پک کلود، VPS)
  output: 'standalone',
  images: { unoptimized: true },
  serverExternalPackages: ['sharp', 'better-sqlite3'],
};

export default nextConfig;
