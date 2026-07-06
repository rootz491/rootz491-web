'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getExperience } from '@/lib/content';

export function ExperienceSection({ preview = false }: { preview?: boolean }) {
  const experience = getExperience();
  const items = preview ? experience.items.slice(0, 2) : experience.items;

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={experience.title} subtitle={experience.subtitle} />
            {preview && <SectionLink href='/about#experience' label='Full timeline' />}
          </div>
        </Reveal>

        <div className='relative max-w-3xl'>
          <div className='absolute left-[7px] top-2 bottom-2 w-px bg-border' />
          <Stagger className='space-y-10'>
            {items.map((item, i) => (
              <StaggerItem key={i}>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-cream bg-background' />
                  <div className='space-y-2'>
                    <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                      <h3 className='font-semibold text-cream'>{item.role}</h3>
                      <span className='text-sm text-cream-muted'>@ {item.company}</span>
                    </div>
                    <p className='text-sm text-cream-muted'>{item.period}</p>
                    <p className='text-base text-cream-muted leading-relaxed'>
                      {item.description}
                    </p>
                    {!preview && (
                      <ul className='mt-3 space-y-1'>
                        {item.highlights.map((h, j) => (
                          <li key={j} className='text-sm text-cream-muted flex gap-2'>
                            <span className='text-cream'>–</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
