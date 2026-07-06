'use client';

import { getSite } from '@/lib/content';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const site = getSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className='sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl'
    >
      <nav className='container flex h-16 items-center justify-between px-6'>
        <Link
          href='/'
          className='text-[20px] font-black tracking-tight text-cream transition-opacity hover:opacity-80'
        >
          {site.brand.wordmark}
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          {site.nav.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
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
            className='inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-cream transition-all hover:border-cream/40 hover:bg-surface-elevated hover:scale-[1.03]'
          >
            <Download className='h-4 w-4' />
            {site.nav.resume.label}
          </a>
        </div>

        <button
          className='md:hidden text-cream'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'
        >
          {open ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='border-t border-border md:hidden'
        >
          <div className='container space-y-1 px-6 py-4'>
            {site.nav.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className='block py-3 text-base font-medium text-cream-muted hover:text-cream'
              >
                {link.label}
              </Link>
            ))}
            <a
              href={site.nav.resume.href}
              download
              className='mt-2 flex items-center gap-2 py-3 text-base font-medium text-cream'
            >
              <Download className='h-4 w-4' />
              {site.nav.resume.label}
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
