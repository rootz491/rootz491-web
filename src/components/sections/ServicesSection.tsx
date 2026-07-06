'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/primitives';
import { getServices } from '@/lib/content';
import { Cloud, Code, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  code: Code,
  server: Server,
  cloud: Cloud,
};

export function ServicesSection({ preview = false }: { preview?: boolean }) {
  const services = getServices();

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <SectionHeading
            title={services.title}
            subtitle={services.subtitle}
            className='mb-10'
          />
        </Reveal>

        <Stagger className='grid gap-6 md:grid-cols-3'>
          {services.items.map(service => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Code;
            return (
              <StaggerItem key={service.title}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(255,253,248,0.2)' }}
                  className='rounded-2xl border border-border bg-surface p-8 h-full transition-colors'
                >
                  <Icon className='h-8 w-8 text-cream mb-5' />
                  <h3 className='text-lg font-semibold text-cream mb-2'>{service.title}</h3>
                  <p className='text-sm text-cream-muted leading-relaxed'>
                    {service.description}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
