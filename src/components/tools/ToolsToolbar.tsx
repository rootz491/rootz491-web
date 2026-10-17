'use client';

import { cn } from '@/lib/utils';

const ALL = 'All';

export function ToolsToolbar({
  categories,
  category,
  query,
  onCategoryChange,
  onQueryChange,
  count,
}: {
  categories: readonly string[];
  category: string;
  query: string;
  onCategoryChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  count: number;
}) {
  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div
        role='group'
        aria-label='Filter by category'
        className='flex min-w-0 flex-wrap gap-2'
      >
        {[ALL, ...categories].map(option => {
          const isActive = category === option;
          return (
            <button
              key={option}
              type='button'
              aria-pressed={isActive}
              onClick={() => onCategoryChange(option)}
              className={cn(
                'min-h-11 rounded-[10px] border px-3 text-sm transition-colors duration-150 [@media(pointer:fine)]:min-h-9',
                isActive
                  ? 'border-cream bg-cream text-background'
                  : 'border-border text-cream-muted pointer-hover:border-border-strong pointer-hover:text-cream'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className='flex w-full flex-col gap-2 lg:max-w-xs lg:shrink-0'>
        <label htmlFor='tool-search' className='text-xs font-medium text-cream'>
          Search tools
        </label>
        <input
          id='tool-search'
          type='search'
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder='Filter by name or description'
          autoComplete='off'
          className='h-11 rounded-[10px] border border-border bg-surface px-3 text-sm text-cream transition-colors placeholder:text-cream-muted/70 [@media(pointer:fine)]:h-10'
        />
        <p aria-live='polite' className='text-sm tabular-nums text-cream-muted'>
          {count} {count === 1 ? 'tool' : 'tools'}
        </p>
      </div>
    </div>
  );
}
