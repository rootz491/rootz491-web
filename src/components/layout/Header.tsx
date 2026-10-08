'use client';

import { getSite } from '@/lib/content';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export function Header() {
  const site = getSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', latest => {
    setScrolled(latest > 24);
  });

  // Lock body scroll + pause Lenis while the mobile menu is open so the two
  // scroll systems never fight each other.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [open, lenis]);

  // Close the mobile menu on route change (no-op when already closed).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-background/90 backdrop-blur-xl'
          : 'border-border/60 bg-background/80 backdrop-blur-xl'
      )}
    >
      <nav
        aria-label='Main navigation'
        className='container flex h-16 items-center justify-between px-6'
      >
        <Link
          href='/'
          aria-current={pathname === '/' ? 'page' : undefined}
          className='text-[20px] font-black tracking-tight text-cream transition-opacity hover:opacity-80'
        >
          {site.brand.wordmark}
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          {site.nav.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'relative text-base font-medium transition-colors',
                pathname === link.href ? 'text-cream' : 'text-cream-muted hover:text-cream'
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.span
                  layoutId='nav-underline'
                  className='absolute -bottom-1 left-0 right-0 h-px bg-cream'
                />
              )}
            </Link>
          ))}
          <a
            href={site.nav.resume.href}
            download
            className='inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-cream transition-all hover:border-cream/40 hover:bg-surface-elevated hover:scale-[1.03] motion-reduce:hover:scale-100'
          >
            <Download className='h-4 w-4' />
            {site.nav.resume.label}
          </a>
        </div>

        <button
          type='button'
          aria-expanded={open}
          aria-controls='mobile-menu'
          aria-label={open ? 'Close menu' : 'Open menu'}
          className='md:hidden h-11 w-11 rounded-md text-cream flex items-center justify-center'
          onClick={() => setOpen(!open)}
        >
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id='mobile-menu'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className='border-t border-border md:hidden'
          >
            <div className='container space-y-1 px-6 py-4 overflow-y-auto max-h-[calc(100vh-64px)]'>
              {site.nav.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className='block py-3 text-base font-medium text-cream-muted hover:text-cream'
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={site.nav.resume.href}
                download
                onClick={() => setOpen(false)}
                className='mt-2 flex items-center gap-2 py-3 text-base font-medium text-cream'
              >
                <Download className='h-4 w-4' />
                {site.nav.resume.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
