import { SocialIcon } from '@/components/icons/SocialIcon';
import { getContact, getSite } from '@/lib/content';
import Link from 'next/link';

export function Footer() {
  const site = getSite();
  const contact = getContact();

  return (
    <footer className='border-t border-border bg-surface'>
      <div className='container px-6 py-12'>
        <div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
          <div className='space-y-2'>
            <p className='text-lg font-black text-cream'>{site.brand.name}</p>
            <p className='text-sm text-cream-muted'>{site.brand.tagline}</p>
          </div>

          <div className='flex flex-wrap gap-6'>
            {site.nav.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm text-cream-muted transition-colors hover:text-cream'
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className='flex gap-3'>
            {contact.social
              .filter(s => s.url)
              .map(social => (
                <a
                  key={social.platform}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='flex h-9 w-9 items-center justify-center rounded-full border border-border text-cream-muted transition-all hover:border-cream/30 hover:text-cream hover:scale-110'
                >
                  <SocialIcon platform={social.platform} className='h-4 w-4' />
                </a>
              ))}
          </div>
        </div>

        <p className='mt-10 text-sm text-cream-muted'>{site.footer.note}</p>
      </div>
    </footer>
  );
}
