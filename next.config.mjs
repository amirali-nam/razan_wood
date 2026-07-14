/** @type {import('next').NextConfig} */
const nextConfig = {
  // خروجی standalone — مناسب هاست Node (لیارا، پارس‌پک کلود، VPS)
  output: 'standalone',
  images: { unoptimized: true },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
