'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getProjects } from '@/lib/content';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function ProjectsSection({ preview = false }: { preview?: boolean }) {
  const projects = getProjects();
  const items = projects.items;

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={projects.title} subtitle={projects.subtitle} />
            {preview && <SectionLink href='/projects' label='All projects' />}
          </div>
        </Reveal>

        <Stagger className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {items.map(project => (
            <StaggerItem key={project.slug}>
              <Link href={`/projects/${project.slug}`} className='group block h-full'>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className='overflow-hidden rounded-2xl border border-border bg-surface h-full'
                >
                  <div className='relative aspect-[16/10] overflow-hidden bg-surface-elevated'>
                    <Image
                      src={project.thumb}
                      alt={project.title}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  </div>
                  <div className='p-6 space-y-2'>
                    <p className='text-xs font-medium uppercase tracking-wider text-cream-muted'>
                      {project.role}
                    </p>
                    <h3 className='text-lg font-semibold text-cream group-hover:text-cream/90'>
                      {project.title}
                    </h3>
                    <p className='text-sm text-cream-muted leading-relaxed line-clamp-2'>
                      {project.summary}
                    </p>
                  </div>
                </motion.article>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
