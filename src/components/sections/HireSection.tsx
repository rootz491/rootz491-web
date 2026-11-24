'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import {
  Button,
  SectionHeading,
  SectionLink,
} from '@/components/ui/primitives';
import { getHire } from '@/lib/content';
import {
  BookOpen,
  Cloud,
  Code,
  Github,
  Globe,
  Send,
  Server,
} from 'lucide-react';
import Link from 'next/link';

const workIcons = {
  code: Code,
  server: Server,
  cloud: Cloud,
};

const SITE_HOST = 'rootz491.com';

function internalPath(href: string): string | null {
  if (href.startsWith('/')) return href;
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');
    if (host !== SITE_HOST) return null;
    return `${url.pathname}${url.search}${url.hash}` || '/';
  } catch {
    return null;
  }
}

function ContactIcon({ href }: { href: string }) {
  const Icon = href.includes('t.me')
    ? Send
    : href.includes('github.com')
      ? Github
      : href.includes('blog.')
        ? BookOpen
        : Globe;
  return <Icon className='h-5 w-5 text-cream' aria-hidden='true' />;
}

export function HireSection({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) {
  const hire = getHire();

  return (
    <>
      <section className='border-t border-border section-spacing'>
        <div className='container px-6'>
          <Reveal>
            <p className='text-xs font-medium uppercase tracking-wider text-cream-muted'>
              {hire.eyebrow}
            </p>
            <SectionHeading
              as={headingAs}
              title={hire.title}
              subtitle={hire.intro}
              className='mt-3'
            />
            <p className='mt-6 max-w-2xl text-base leading-relaxed text-cream-muted'>
              {hire.summary}
            </p>
            <p className='mt-4 text-sm leading-relaxed text-cream-muted'>
              {hire.locationLabel} {hire.location}. {hire.timezone}.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              {hire.ctas.map(cta => (
                <Button key={cta.href} href={cta.href} variant={cta.variant}>
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id='work'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading
              title={hire.work.title}
              subtitle={hire.work.subtitle}
              className='mb-10'
            />
          </Reveal>
          <Stagger className='grid gap-6 md:grid-cols-3'>
            {hire.work.items.map(item => {
              const Icon = workIcons[item.icon] || Code;
              return (
                <StaggerItem key={item.title} className='h-full'>
                  <article className='h-full rounded-2xl border border-border bg-surface p-8 transition-[border-color,transform] duration-300 ease-out pointer-hover:-translate-y-1 pointer-hover:border-cream/30 motion-reduce:pointer-hover:translate-y-0'>
                    <Icon
                      className='mb-5 h-8 w-8 text-cream'
                      aria-hidden='true'
                    />
                    <h3 className='text-h3 mb-2 text-cream'>{item.title}</h3>
                    <p className='text-sm leading-relaxed text-cream-muted'>
                      {item.description}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section
        id='start'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            <Reveal>
              <SectionHeading title={hire.start.title} className='mb-8' />
              <ol className='space-y-5'>
                {hire.start.steps.map((step, index) => (
                  <li key={step} className='flex gap-4'>
                    <span
                      aria-hidden='true'
                      className='mt-0.5 w-6 shrink-0 text-sm font-medium tabular-nums text-cream'
                    >
                      {index + 1}
                    </span>
                    <p className='text-base leading-relaxed text-cream-muted'>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.08}>
              <SectionHeading title={hire.engagement.title} className='mb-8' />
              {hire.engagement.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`text-base leading-relaxed text-cream-muted${index > 0 ? ' mt-4' : ''}`}
                >
                  {paragraph}
                </p>
              ))}
              <p className='mt-8 max-w-prose text-sm leading-relaxed text-cream-muted'>
                {hire.personal}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id='contact'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading
              title={hire.contacts.title}
              subtitle={hire.contacts.subtitle}
              className='mb-10'
            />
          </Reveal>
          <Stagger className='grid gap-4 sm:grid-cols-2'>
            {hire.contacts.items.map(item => {
              const path = internalPath(item.href);
              const className =
                'flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-[border-color,background-color] duration-300 ease-out pointer-hover:border-cream/30 pointer-hover:bg-surface-elevated';
              const body = (
                <>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated'>
                    <ContactIcon href={item.href} />
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-cream'>{item.label}</p>
                    <p className='mt-0.5 truncate text-sm text-cream-muted'>
                      {item.detail}
                    </p>
                  </div>
                </>
              );

              return (
                <StaggerItem key={item.href} className='h-full'>
                  {path ? (
                    <Link href={path} className={className}>
                      {body}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={className}
                    >
                      {body}
                    </a>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal delay={0.05}>
            <div className='mt-8 flex flex-wrap items-center gap-x-6 gap-y-2'>
              <p className='max-w-xl text-sm leading-relaxed text-cream-muted'>
                {hire.elsewhere.intro}
              </p>
              <SectionLink
                href={hire.elsewhere.href}
                label={hire.elsewhere.linkLabel}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
