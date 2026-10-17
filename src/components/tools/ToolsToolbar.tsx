'use client';

import type { ToolSort } from '@/lib/tools';
import type { ToolView } from '@/lib/toolPrefs';
import { cn } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';
import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

const ALL = 'All';

const controlHeight = 'h-11 [@media(pointer:fine)]:h-9';

const viewButton =
  'inline-flex items-center justify-center gap-1.5 rounded-[10px] border px-3 text-sm transition-colors duration-150';
const viewSelected = 'border-border-strong bg-surface-elevated text-cream';
const viewIdle =
  'border-border text-cream-muted pointer-hover:border-border-strong pointer-hover:text-cream';

export function ToolsToolbar({
  categories,
  category,
  query,
  sort,
  view,
  onCategoryChange,
  onQueryChange,
  onSortChange,
  onViewChange,
  onClear,
  count,
}: {
  categories: readonly string[];
  category: string;
  query: string;
  sort: ToolSort;
  view: ToolView;
  onCategoryChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: ToolSort) => void;
  onViewChange: (value: ToolView) => void;
  onClear: () => void;
  count: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const clearable = category !== ALL || query.trim() !== '';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && query !== '') {
      event.preventDefault();
      onQueryChange('');
    }
  };

  return (
    <div className='flex flex-col gap-3'>
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

      <div className='flex flex-wrap items-end gap-2'>
        <div className='min-w-0 basis-full sm:basis-0 sm:flex-1 lg:max-w-sm'>
          <label htmlFor='tool-search' className='block text-xs font-medium text-cream'>
            Search tools
          </label>
          <div className='relative mt-1'>
            <input
              ref={inputRef}
              id='tool-search'
              type='search'
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder='Search tools, domains…'
              autoComplete='off'
              className='h-11 w-full min-w-0 rounded-[10px] border border-border bg-surface px-3 text-sm text-cream transition-colors placeholder:text-cream-muted/70 [@media(pointer:fine)]:h-9 [@media(pointer:fine)]:pr-9'
            />
            <kbd
              aria-hidden='true'
              className='pointer-events-none absolute right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded border border-border bg-surface-elevated text-[11px] text-cream-muted [@media(pointer:fine)]:inline-flex'
            >
              /
            </kbd>
          </div>
        </div>

        <div className='min-w-0 flex-1 sm:flex-none'>
          <label htmlFor='tool-sort' className='block text-xs font-medium text-cream'>
            Sort
          </label>
          <select
            id='tool-sort'
            value={sort}
            onChange={event => onSortChange(event.target.value as ToolSort)}
            className={cn(
              'mt-1 w-full rounded-[10px] border border-border bg-surface px-2.5 text-sm text-cream transition-colors sm:w-auto',
              controlHeight
            )}
          >
            <option value='default'>Default order</option>
            <option value='name'>Name A–Z</option>
          </select>
        </div>

        <div role='group' aria-label='View' className='flex shrink-0 items-center gap-1'>
          <button
            type='button'
            aria-pressed={view === 'grid'}
            onClick={() => onViewChange('grid')}
            className={cn(
              viewButton,
              controlHeight,
              view === 'grid' ? viewSelected : viewIdle
            )}
          >
            <LayoutGrid className='h-4 w-4 shrink-0' aria-hidden='true' />
            <span className='hidden sm:inline'>Grid</span>
            <span className='sr-only sm:hidden'>Grid view</span>
          </button>
          <button
            type='button'
            aria-pressed={view === 'list'}
            onClick={() => onViewChange('list')}
            className={cn(
              viewButton,
              controlHeight,
              view === 'list' ? viewSelected : viewIdle
            )}
          >
            <List className='h-4 w-4 shrink-0' aria-hidden='true' />
            <span className='hidden sm:inline'>List</span>
            <span className='sr-only sm:hidden'>List view</span>
          </button>
        </div>

        {clearable && (
          <button
            type='button'
            onClick={onClear}
            className={cn(
              'inline-flex items-center justify-center rounded-[10px] px-3 text-sm text-cream-muted transition-colors duration-150 pointer-hover:text-cream',
              controlHeight
            )}
          >
            Clear filters
          </button>
        )}
      </div>

      <p aria-live='polite' className='text-sm tabular-nums text-cream-muted'>
        {count} {count === 1 ? 'tool' : 'tools'}
      </p>
    </div>
  );
}
