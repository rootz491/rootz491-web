'use client';

import { Reveal } from '@/components/motion/Reveal';
import { Toast, type ToastMessage } from '@/components/tools/Toast';
import { ToolGroup } from '@/components/tools/ToolGroup';
import { ToolsEmptyState } from '@/components/tools/ToolsEmptyState';
import { ToolsToolbar } from '@/components/tools/ToolsToolbar';
import { SectionHeading } from '@/components/ui/primitives';
import { getToolCategories, getTools } from '@/lib/content';
import {
  FAVORITES_KEY,
  SORT_KEY,
  VIEW_KEY,
  parseFavorites,
  parseSort,
  parseView,
  readPref,
  toggleFavorite,
  writePref,
  type ToolView,
} from '@/lib/toolPrefs';
import {
  filterTools,
  groupByCategory,
  sortTools,
  type ToolSort,
} from '@/lib/tools';
import { useCallback, useEffect, useRef, useState } from 'react';

const ALL = 'All';

export function ToolsExplorer() {
  const tools = getTools();
  const categories = getToolCategories();

  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ToolSort>('default');
  const [view, setView] = useState<ToolView>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<ToastMessage>({ id: 0, text: '' });
  const toastId = useRef(0);

  // Restore stored prefs after mount so the first render stays on the defaults
  // and the server markup matches the client.
  useEffect(() => {
    const validSlugs = tools.items.map(tool => tool.slug);
    setView(parseView(readPref(VIEW_KEY)));
    setSort(parseSort(readPref(SORT_KEY)));
    setFavorites(parseFavorites(readPref(FAVORITES_KEY), validSlugs));
    setHydrated(true);
  }, [tools.items]);

  useEffect(() => {
    if (!hydrated) return;
    writePref(VIEW_KEY, view);
  }, [hydrated, view]);

  useEffect(() => {
    if (!hydrated) return;
    writePref(SORT_KEY, sort);
  }, [hydrated, sort]);

  useEffect(() => {
    if (!hydrated) return;
    writePref(FAVORITES_KEY, JSON.stringify(favorites));
  }, [hydrated, favorites]);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, text: message });
  }, []);

  const handleToggleFavorite = useCallback(
    (slug: string) => {
      setFavorites(prev => toggleFavorite(prev, slug));
      // The tool moves between groups when (un)favorited, which remounts it.
      // Keep keyboard focus on its favorite button in the new position.
      const url = tools.items.find(tool => tool.slug === slug)?.url;
      if (!url) return;
      requestAnimationFrame(() => {
        const button = Array.from(
          document.querySelectorAll<HTMLButtonElement>('button[data-fav-url]')
        ).find(el => el.dataset.favUrl === url);
        button?.focus({ preventScroll: false });
      });
    },
    [tools.items]
  );

  const clearFilters = () => {
    setCategory(ALL);
    setQuery('');
  };

  const filtered = filterTools(tools.items, category, query);
  const sorted = sortTools(filtered, sort);
  const favoriteSet = new Set(favorites);
  const favoriteItems = sorted.filter(tool => favoriteSet.has(tool.slug));
  const rest = sorted.filter(tool => !favoriteSet.has(tool.slug));
  const groups = groupByCategory(rest, categories);

  return (
    <section className='pt-10 pb-16 md:pt-14 md:pb-24'>
      <div className='container px-6'>
        <Reveal>
          <SectionHeading as='h1' title={tools.title} subtitle={tools.subtitle} className='mb-8' />
        </Reveal>

        <ToolsToolbar
          categories={categories}
          category={category}
          query={query}
          sort={sort}
          view={view}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          onSortChange={setSort}
          onViewChange={setView}
          onClear={clearFilters}
          count={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className='mt-6 space-y-8'>
            {favoriteItems.length > 0 && (
              <ToolGroup
                category='Favorites'
                items={favoriteItems}
                view={view}
                favorites={favorites}
                star
                onToggleFavorite={handleToggleFavorite}
                onToast={showToast}
              />
            )}

            {groups.map(group => (
              <ToolGroup
                key={group.category}
                category={group.category}
                items={group.items}
                view={view}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className='mt-6'>
            <ToolsEmptyState query={query} onClear={clearFilters} />
          </div>
        )}
      </div>

      <Toast toast={toast} />
    </section>
  );
}
