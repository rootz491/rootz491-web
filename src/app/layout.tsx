import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = genMeta();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${inter.variable} font-sans`}>
        <div className='flex min-h-screen flex-col'>
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
