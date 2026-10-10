'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/primitives';
import { getToolCategories, getTools } from '@/lib/content';
import type { Tool } from '@/lib/content/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  ExternalLink,
  FileText,
  GitCompare,
  Hash,
  IndianRupee,
  KeyRound,
  LayoutGrid,
  Link as LinkIcon,
  Mail,
  Network,
  QrCode,
  Radar,
  Regex,
  ShieldCheck,
  Webhook,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  FileText,
  GitCompare,
  Hash,
  IndianRupee,
  KeyRound,
  LayoutGrid,
  Link: LinkIcon,
  Mail,
  Network,
  QrCode,
  Radar,
  Regex,
  ShieldCheck,
  Webhook,
};

const ALL = 'All';

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = iconMap[tool.icon] ?? Wrench;

  return (
    <a
      href={tool.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group block h-full rounded-2xl'
      aria-label={`${tool.name} — ${tool.description}`}
    >
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className='flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color] duration-300 group-hover:border-cream/20'
      >
        <div className='mb-4 flex items-center gap-3'>
          <span className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-elevated'>
            <Icon className='h-5 w-5 text-cream' aria-hidden='true' />
          </span>
          <h3 className='text-h3 text-cream'>{tool.name}</h3>
        </div>
        <p className='text-sm leading-relaxed text-cream-muted'>{tool.description}</p>
        <span className='mt-auto inline-flex items-center gap-1 pt-5 text-sm text-cream-muted transition-colors group-hover:text-cream'>
          Open tool
          <ExternalLink className='h-3.5 w-3.5' aria-hidden='true' />
        </span>
      </motion.article>
    </a>
  );
}

export function ToolsExplorer() {
  const tools = getTools();
  const categories = getToolCategories();
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = tools.items.filter(tool => {
    const matchesCategory = category === ALL || tool.category === category;
    const matchesQuery =
      normalizedQuery === '' ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const groups = categories
    .map(cat => ({ category: cat, items: filtered.filter(t => t.category === cat) }))
    .filter(group => group.items.length > 0);

  return (
    <section className='border-t border-border section-spacing'>
      <div className='container px-6'>
        <Reveal>
          <SectionHeading title={tools.title} subtitle={tools.subtitle} className='mb-8' />
        </Reveal>

        <Reveal delay={0.05}>
          <div className='mb-10 flex flex-col gap-6'>
            <div
              className='flex flex-wrap gap-2'
              role='group'
              aria-label='Filter tools by category'
            >
              {[ALL, ...categories].map(option => {
                const isActive = category === option;
                return (
                  <button
                    key={option}
                    type='button'
                    aria-pressed={isActive}
                    onClick={() => setCategory(option)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-cream bg-cream text-background'
                        : 'border-border text-cream-muted hover:border-cream/40 hover:text-cream'
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className='flex flex-col gap-2 sm:max-w-md'>
              <label htmlFor='tool-search' className='text-sm font-medium text-cream'>
                Search tools
              </label>
              <input
                id='tool-search'
                type='search'
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder='Filter by name or description'
                autoComplete='off'
                className='h-11 w-full rounded-md border border-border bg-surface px-4 text-sm text-cream transition-colors placeholder:text-cream-muted hover:border-cream/30'
              />
            </div>

            <p aria-live='polite' className='text-sm text-cream-muted'>
              {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
            </p>
          </div>
        </Reveal>

        {groups.length > 0 ? (
          <div className='space-y-12'>
            {groups.map(group => (
              <div key={group.category} className='space-y-4'>
                <p className='text-xs font-semibold uppercase tracking-wider text-cream-muted'>
                  {group.category}
                </p>
                <Stagger className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {group.items.map(tool => (
                    <StaggerItem key={tool.slug} className='h-full'>
                      <ToolCard tool={tool} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
        ) : (
          <p className='rounded-2xl border border-border bg-surface p-8 text-center text-sm text-cream-muted'>
            {normalizedQuery
              ? `No tools match “${query.trim()}”. Try a different search or category.`
              : 'No tools in this category.'}
          </p>
        )}
      </div>
    </section>
  );
}
