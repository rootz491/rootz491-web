'use client';

import { ToolCard } from '@/components/tools/ToolCard';
import { ToolRow } from '@/components/tools/ToolRow';
import type { Tool } from '@/lib/content/types';
import type { ToolView } from '@/lib/toolPrefs';
import { Star } from 'lucide-react';

export function ToolGroup({
  category,
  items,
  view,
  favorites,
  star = false,
  onToggleFavorite,
  onToast,
}: {
  category: string;
  items: Tool[];
  view: ToolView;
  favorites: readonly string[];
  star?: boolean;
  onToggleFavorite: (slug: string) => void;
  onToast: (message: string) => void;
}) {
  const headingId = `tools-group-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const favoriteSet = new Set(favorites);

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-cream-muted'
      >
        {star && <Star className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />}
        <span>
          {category} <span className='tabular-nums'>{items.length}</span>
        </span>
      </h2>

      {view === 'grid' ? (
        <ul
          role='list'
          className='mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
          {items.map(tool => (
            <li key={tool.slug} className='min-w-0'>
              <ToolCard
                tool={tool}
                isFavorite={favoriteSet.has(tool.slug)}
                onToggleFavorite={() => onToggleFavorite(tool.slug)}
                onToast={onToast}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul
          role='list'
          className='mt-3 divide-y divide-border rounded-xl border border-border bg-surface'
        >
          {items.map(tool => (
            <ToolRow
              key={tool.slug}
              tool={tool}
              isFavorite={favoriteSet.has(tool.slug)}
              onToggleFavorite={() => onToggleFavorite(tool.slug)}
              onToast={onToast}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
