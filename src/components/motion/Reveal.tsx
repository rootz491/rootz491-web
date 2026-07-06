'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const offset = {
    up: { y: 32 },
    down: { y: -32 },
    left: { x: 32 },
    right: { x: -32 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={defaultVariants}>
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
