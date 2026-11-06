'use client';

import { Button } from '@/components/ui/primitives';
import { getProfile } from '@/lib/content';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

export function HeroSection({ preview = false }: { preview?: boolean }) {
  const { hero } = getProfile();
  const [imageError, setImageError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, -16]);

  return (
    <section ref={sectionRef} className={preview ? 'py-16' : 'py-24 md:py-32'}>
      <div className='container px-6'>
        <div className='grid items-center gap-12 lg:grid-cols-[1fr_auto]'>
          <div className='space-y-6 max-w-3xl'>
            <p className='text-base text-cream-muted'>{hero.greeting}</p>

            <h1 className='text-[40px] font-black leading-tight text-cream md:text-[56px]'>
              {hero.name}
            </h1>

            <p className='text-xl font-medium text-cream-muted'>
              @{hero.alias} · {hero.role}
            </p>

            <p className='text-[28px] font-medium leading-[38px] text-cream/90'>
              {hero.headline}
            </p>

            {!preview && (
              <p className='text-base text-cream-muted max-w-xl'>
                {hero.bio}
              </p>
            )}

            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: avatarY }}
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
