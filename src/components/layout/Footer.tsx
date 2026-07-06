import { getContact, getSite } from '@/lib/content';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
};

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

          <div className='flex gap-4'>
            {contact.social
              .filter(s => s.url)
              .map(social => {
                const Icon = iconMap[social.platform as keyof typeof iconMap];
                if (!Icon) return null;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.label}
                    className='text-cream-muted transition-all hover:text-cream hover:scale-110'
                  >
                    <Icon className='h-5 w-5' />
                  </a>
                );
              })}
          </div>
        </div>

        <p className='mt-10 text-sm text-cream-muted'>{site.footer.note}</p>
      </div>
    </footer>
  );
}
