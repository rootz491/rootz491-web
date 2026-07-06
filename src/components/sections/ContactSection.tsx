'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading, SectionLink } from '@/components/ui/primitives';
import { getContact } from '@/lib/content';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
};

export function ContactSection({ preview = false }: { preview?: boolean }) {
  const contact = getContact();

  return (
    <section className='border-t border-border py-16 md:py-24'>
      <div className='container px-6'>
        <Reveal>
          <div className='flex items-end justify-between gap-4 mb-10'>
            <SectionHeading title={contact.title} subtitle={contact.subtitle} />
            {preview && <SectionLink href='/contact' label='Get in touch' />}
          </div>
        </Reveal>

        <Stagger className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {contact.social
            .filter(s => s.url)
            .map(social => {
              const Icon = iconMap[social.platform as keyof typeof iconMap];
              return (
                <StaggerItem key={social.platform}>
                  <motion.a
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-cream/30 hover:bg-surface-elevated'
                  >
                    {Icon && <Icon className='h-6 w-6 text-cream' />}
                    <div>
                      <p className='font-semibold text-cream'>{social.label}</p>
                      {social.handle && (
                        <p className='text-sm text-cream-muted mt-1'>{social.handle}</p>
                      )}
                    </div>
                  </motion.a>
                </StaggerItem>
              );
            })}
        </Stagger>
      </div>
    </section>
  );
}
