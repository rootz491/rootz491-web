'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getSkills } from '@/lib/content';
import { motion } from 'framer-motion';

export function SkillsSection({ preview = false }: { preview?: boolean }) {
  const skills = getSkills();
  const categories = preview ? skills.categories.slice(0, 3) : skills.categories;

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={skills.title} subtitle={skills.subtitle} />
            {preview && <SectionLink href='/about#skills' label='All skills' />}
          </div>
        </Reveal>

        <Stagger className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map(cat => (
            <StaggerItem key={cat.name}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className='rounded-2xl border border-border bg-surface p-6 h-full'
              >
                <h3 className='text-sm font-semibold uppercase tracking-wider text-cream mb-4'>
                  {cat.name}
                </h3>
                <ul className='flex flex-wrap gap-2'>
                  {cat.items.map(item => (
                    <li
                      key={item}
                      className='rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-cream-muted'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        {!preview && skills.interests && (
          <Reveal delay={0.15}>
            <div className='mt-12 max-w-3xl'>
              <h3 className='text-lg font-semibold text-cream mb-5'>
                {skills.interests.title}
              </h3>
              <ul className='grid gap-3 sm:grid-cols-2'>
                {skills.interests.items.map(item => (
                  <li
                    key={item}
                    className='flex items-start gap-2 text-sm text-cream-muted'
                  >
                    <span className='text-cream shrink-0'>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
