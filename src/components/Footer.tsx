import { getNavigation, getSharedContent, getSiteConfig } from '@/lib/content';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
};

export function Footer() {
  const siteConfig = getSiteConfig();
  const nav = getNavigation();
  const shared = getSharedContent();
  const contact = siteConfig.contact;

  return (
    <footer className='border-t bg-muted/40'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold'>{siteConfig.brand.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {siteConfig.brand.tagline}
            </p>
            <div className='flex space-x-4'>
              {siteConfig.social.map(social => {
                if (!social.url) return null;
                const Icon = iconMap[social.platform as keyof typeof iconMap];
                return Icon ? (
                  <Link
                    key={social.platform}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground hover:text-primary'
                    aria-label={social.platform}
                  >
                    <Icon className='h-5 w-5' />
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold'>Navigation</h4>
            <ul className='space-y-2 text-sm'>
              {nav.primary.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold'>Legal</h4>
            <ul className='space-y-2 text-sm'>
              {nav.footer.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold'>Contact</h4>
            <address className='not-italic text-sm text-muted-foreground space-y-2'>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className='hover:text-primary'
                >
                  {contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${contact.phone}`} className='hover:text-primary'>
                  {contact.phone}
                </a>
              </p>
              <p>{contact.hours}</p>
            </address>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='mt-8 border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>{shared.footerNote}</p>
            <div className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
              <span>PAN: {siteConfig.legal.pan}</span>
              <span>GST: {siteConfig.legal.gstin}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
