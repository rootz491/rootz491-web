'use client';

import { SocialIcon } from '@/components/icons/SocialIcon';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getBlogs } from '@/lib/content';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function BlogsSection({ preview = false }: { preview?: boolean }) {
  const blogs = getBlogs();
  const platforms = preview ? blogs.platforms.slice(0, 2) : blogs.platforms;

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={blogs.title} subtitle={blogs.subtitle} />
            {preview && <SectionLink href='/blog' label='All posts' />}
          </div>
        </Reveal>

        <Stagger className='grid gap-6 md:grid-cols-2'>
          {platforms.map(platform => (
            <StaggerItem key={platform.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className='rounded-2xl border border-border bg-surface p-6 h-full'
              >
                <div className='flex items-center justify-between gap-4 mb-5'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated'>
                      <SocialIcon platform={platform.icon} className='h-5 w-5 text-cream' />
                    </div>
                    <h3 className='font-semibold text-cream'>{platform.name}</h3>
                  </div>
                  {platform.profileUrl && (
                    <a
                      href={platform.profileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-cream-muted hover:text-cream transition-colors inline-flex items-center gap-1'
                    >
                      Profile
                      <ExternalLink className='h-3.5 w-3.5' />
                    </a>
                  )}
                </div>

                {platform.posts.length > 0 ? (
                  <ul className='space-y-3'>
                    {(preview ? platform.posts.slice(0, 2) : platform.posts).map(
                      (post, i) => (
                        <li key={i}>
                          <a
                            href={post.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group flex items-start gap-2 text-sm text-cream-muted hover:text-cream transition-colors'
                          >
                            <span className='text-cream mt-0.5 shrink-0'>→</span>
                            <span className='group-hover:underline'>{post.title}</span>
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className='text-sm text-cream-muted'>
                    Posts coming soon — follow on{' '}
                    <a
                      href={platform.profileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-cream hover:underline'
                    >
                      {platform.name}
                    </a>
                  </p>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
