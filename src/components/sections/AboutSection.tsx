'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getAbout } from '@/lib/content';

export function AboutSection({ preview = false }: { preview?: boolean }) {
  const about = getAbout();

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={about.title} subtitle={about.intro} />
            {preview && <SectionLink href='/about' label='Read more' />}
          </div>
        </Reveal>

        <Stagger className='grid gap-8 lg:grid-cols-2'>
          <StaggerItem>
            {preview ? (
              <p className='text-lg text-cream-muted leading-relaxed'>{about.bio[0]}</p>
            ) : (
              about.bio.map((p, i) => (
                <p
                  key={i}
                  className={`text-base text-cream-muted leading-relaxed${i > 0 ? ' mt-4' : ''}`}
                >
                  {p}
                </p>
              ))
            )}
          </StaggerItem>

          <StaggerItem>
            <ul className='space-y-3'>
              {about.highlights.map((h, i) => (
                <li
                  key={i}
                  className='flex items-start gap-3 text-cream-muted before:content-["→"] before:text-cream before:shrink-0'
                >
                  {h}
                </li>
              ))}
            </ul>
            <p className='mt-6 text-sm text-cream-muted'>📍 {about.location}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
