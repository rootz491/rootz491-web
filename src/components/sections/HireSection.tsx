'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Button, SectionHeading } from '@/components/ui/primitives';
import { getHire, getProjects } from '@/lib/content';
import { cn } from '@/lib/utils';
import { Cloud, Code, Cpu } from 'lucide-react';
import Link from 'next/link';

const packageIcons = {
  code: Code,
  cloud: Cloud,
  cpu: Cpu,
};

export function HireSection({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) {
  const hire = getHire();
  const bySlug = new Map(getProjects().items.map(project => [project.slug, project]));
  const projects = hire.work.slugs.flatMap(slug => {
    const project = bySlug.get(slug);
    return project ? [project] : [];
  });

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
              title={hire.headline}
              className='mt-3 max-w-3xl'
            />
            <p className='mt-6 max-w-2xl text-base leading-relaxed text-cream-muted'>
              {hire.intro}
            </p>
            <p className='mt-4 max-w-2xl text-base leading-relaxed text-cream-muted'>
              {hire.traveller}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id='packages'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading
              title={hire.packages.title}
              subtitle={hire.packages.subtitle}
              className='mb-10'
            />
          </Reveal>
          <Stagger className='grid gap-6 lg:grid-cols-3'>
            {hire.packages.items.map(item => {
              const Icon = packageIcons[item.icon] || Code;
              return (
                <StaggerItem key={item.title} className='h-full'>
                  <article
                    className={cn(
                      'flex h-full flex-col rounded-2xl border bg-surface p-6 transition-[border-color,transform] duration-300 ease-out pointer-hover:-translate-y-1 motion-reduce:pointer-hover:translate-y-0 sm:p-8',
                      item.lead
                        ? 'border-cream/30'
                        : 'border-border pointer-hover:border-cream/30'
                    )}
                  >
                    <Icon className='mb-5 h-8 w-8 text-cream' aria-hidden='true' />
                    {item.leadLabel && (
                      <p className='mb-2 text-xs font-medium uppercase tracking-wider text-cream-muted'>
                        {item.leadLabel}
                      </p>
                    )}
                    <h3 className='text-h3 text-cream'>{item.title}</h3>
                    <ul className='mt-4 space-y-2'>
                      {item.points.map(point => (
                        <li
                          key={point}
                          className='text-sm leading-relaxed text-cream-muted'
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section
        id='pricing'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading title={hire.pricing.title} className='mb-6' />
            <p className='max-w-2xl text-base leading-relaxed text-cream-muted'>
              {hire.pricing.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id='process'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading title={hire.process.title} className='mb-8' />
            <ol className='max-w-2xl space-y-6'>
              {hire.process.steps.map((step, index) => (
                <li key={step.title} className='flex gap-4'>
                  <span
                    aria-hidden='true'
                    className='mt-0.5 w-6 shrink-0 text-sm font-medium tabular-nums text-cream'
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className='text-h3 text-cream'>{step.title}</h3>
                    <p className='mt-1 text-base leading-relaxed text-cream-muted'>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className='mt-8 text-sm leading-relaxed text-cream-muted'>
              {hire.process.location}
            </p>
            <p className='mt-3 max-w-2xl border-l border-cream/30 pl-4 text-sm leading-relaxed text-cream-muted'>
              {hire.process.overlapTodo}
            </p>
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
          <Stagger className='grid gap-4 md:grid-cols-2'>
            {projects.map(project => (
              <StaggerItem key={project.slug} className='h-full'>
                <Link
                  href={`/projects/${project.slug}`}
                  className='block h-full rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 ease-out pointer-hover:-translate-y-1 pointer-hover:border-cream/30 motion-reduce:pointer-hover:translate-y-0'
                >
                  <p className='text-xs font-medium uppercase tracking-wider text-cream-muted'>
                    {project.role}
                  </p>
                  <h3 className='text-h3 mt-2 text-cream'>{project.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-cream-muted'>
                    {project.summary}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id='book'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <h2 className='text-h2 max-w-2xl text-cream'>{hire.booking.prompt}</h2>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Button href={hire.booking.href} variant='primary'>
                {hire.booking.label}
              </Button>
              <Button href={hire.booking.telegramHref} variant='secondary'>
                {hire.booking.telegramLabel}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id='faq'
        className='scroll-mt-20 border-t border-border section-spacing'
      >
        <div className='container px-6'>
          <Reveal>
            <SectionHeading title={hire.faq.title} className='mb-8' />
            <div className='max-w-2xl space-y-8'>
              {hire.faq.items.map(item => (
                <div key={item.question}>
                  <h3 className='text-h3 text-cream'>{item.question}</h3>
                  <p
                    className={cn(
                      'mt-2 text-base leading-relaxed text-cream-muted',
                      item.answer.startsWith('TODO') &&
                        'border-l border-cream/30 pl-4'
                    )}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
