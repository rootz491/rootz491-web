'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getExperience } from '@/lib/content';
import Link from 'next/link';

export function ExperienceSection({ preview = false }: { preview?: boolean }) {
  const experience = getExperience();
  const items = preview ? experience.items.slice(0, 3) : experience.items;

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
          <Stagger className='space-y-12'>
            {items.map((item, i) => (
              <StaggerItem key={i}>
                <div className='relative pl-8'>
                  <div className='absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-cream bg-background' />
                  <div className='space-y-4'>
                    <div>
                      {item.url ? (
                        <Link
                          href={item.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-lg font-semibold text-cream hover:underline'
                        >
                          {item.company}
                        </Link>
                      ) : (
                        <h3 className='text-lg font-semibold text-cream'>{item.company}</h3>
                      )}
                      <p className='text-sm text-cream-muted mt-1'>
                        {item.period}
                        {item.duration ? ` · ${item.duration}` : ''}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>

                    {item.roles.map((role, j) => (
                      <div
                        key={j}
                        className={j > 0 ? 'pt-4 border-t border-border/60' : ''}
                      >
                        <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                          <h4 className='font-medium text-cream'>{role.title}</h4>
                          {role.employmentType && (
                            <span className='text-xs text-cream-muted'>
                              · {role.employmentType}
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-cream-muted mt-1'>
                          {role.period}
                          {role.duration ? ` · ${role.duration}` : ''}
                          {role.location ? ` · ${role.location}` : ''}
                        </p>
                        {!preview && (
                          <>
                            <p className='mt-2 text-sm text-cream-muted leading-relaxed'>
                              {role.description}
                            </p>
                            {role.skills && role.skills.length > 0 && (
                              <div className='mt-3 flex flex-wrap gap-2'>
                                {role.skills.map(skill => (
                                  <span
                                    key={skill}
                                    className='rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs text-cream-muted'
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
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
