import { cn } from '@/lib/utils';
import Link from 'next/link';
import { type ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentProps<'a'> {
  variant?: ButtonVariant;
  href: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-cream text-background hover:bg-cream/90 shadow-[0_0_24px_rgba(255,253,248,0.15)]',
  secondary:
    'border border-border bg-transparent text-cream hover:border-cream/40 hover:bg-surface-elevated',
  ghost: 'text-cream-muted hover:text-cream',
};

function isExternal(href: string) {
  return href.startsWith('http') || href.startsWith('mailto:');
}

export function Button({
  variant = 'primary',
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]',
    variants[variant],
    className
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={classes}
        target='_blank'
        rel='noopener noreferrer'
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <h2 className='text-[25px] font-semibold leading-[38px] text-cream'>{title}</h2>
      {subtitle && <p className='text-base text-cream-muted max-w-2xl'>{subtitle}</p>}
    </div>
  );
}

export function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className='group inline-flex items-center gap-2 text-sm font-medium text-cream-muted transition-colors hover:text-cream'
    >
      {label}
      <span className='transition-transform duration-300 group-hover:translate-x-1'>→</span>
    </Link>
  );
}
