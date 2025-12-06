import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';
import { Inter, Poller_One } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const pollerOne = Poller_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poller-one',
});

export const metadata: Metadata = genMeta();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} ${pollerOne.variable}`}>
        <div className='flex min-h-screen flex-col'>
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
