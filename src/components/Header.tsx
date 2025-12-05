'use client';

import { Button } from '@/components/ui/button';
import { getNavigation, getSiteConfig } from '@/lib/content';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nav = getNavigation();
  const siteConfig = getSiteConfig();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <span className='text-xl font-bold'>{siteConfig.brand.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex md:items-center md:space-x-6'>
          {nav.primary.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium transition-colors hover:text-primary'
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size='sm'>
            <Link href={nav.cta.href}>{nav.cta.label}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden border-t'>
          <div className='container mx-auto px-4 py-4 space-y-3'>
            {nav.primary.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className='block py-2 text-sm font-medium transition-colors hover:text-primary'
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className='w-full' size='sm'>
              <Link
                href={nav.cta.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {nav.cta.label}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
