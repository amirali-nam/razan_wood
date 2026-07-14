import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import ScrollFX from '@/components/ScrollFX';
import { SITE } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'رزان | دستسازه‌های چوبی — رنگ زندگی بر تن چوب',
    template: '%s | رزان',
  },
  description:
    'رزان؛ دستسازه‌های چوبی با منبت‌کاری دستی. جعبه، قندان، تابلو و نوشت‌افزار چوبی دست‌ساز. سفارش از طریق دایرکت اینستاگرام و واتساپ.',
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'fa_IR',
    images: ['/images/pedestal-bowl-1.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div id="progress" />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
        <ScrollFX />
      </body>
    </html>
  );
}
