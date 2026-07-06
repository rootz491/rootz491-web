'use client';

import { Button } from '@/components/ui/primitives';
import { FadeIn } from '@/components/motion/Reveal';
import { getProfile } from '@/lib/content';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export function HeroSection({ preview = false }: { preview?: boolean }) {
  const { hero } = getProfile();
  const [imageError, setImageError] = useState(false);

  return (
    <section className={preview ? 'py-16' : 'py-24 md:py-32'}>
      <div className='container px-6'>
        <div className='grid items-center gap-12 lg:grid-cols-[1fr_auto]'>
          <div className='space-y-6 max-w-3xl'>
            <FadeIn>
              <p className='text-base text-cream-muted'>{hero.greeting}</p>
            </FadeIn>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className='text-[40px] font-black leading-tight text-cream md:text-[56px]'
            >
              {hero.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className='text-xl font-medium text-cream-muted'
            >
              @{hero.alias} · {hero.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className='text-[28px] font-medium leading-[38px] text-cream/90'
            >
              {hero.headline}
            </motion.p>

            {!preview && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className='text-base text-cream-muted max-w-xl'
              >
                {hero.bio}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='flex flex-wrap gap-3 pt-2'
            >
              {hero.ctas.map(cta => (
                <Button key={cta.href} href={cta.href} variant={cta.variant}>
                  {cta.label}
                </Button>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='relative mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-full border-2 border-border md:h-56 md:w-56'
          >
            {!imageError && hero.avatar ? (
              <Image
                src={hero.avatar}
                alt={hero.name}
                fill
                className='object-cover'
                priority
                sizes='(max-width: 768px) 192px, 224px'
                onError={() => setImageError(true)}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-surface-elevated text-4xl font-black text-cream-muted'>
                {hero.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
