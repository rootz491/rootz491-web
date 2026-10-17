'use client';

import { Reveal } from '@/components/motion/Reveal';
import { ToolGroup } from '@/components/tools/ToolGroup';
import { ToolsEmptyState } from '@/components/tools/ToolsEmptyState';
import { ToolsToolbar } from '@/components/tools/ToolsToolbar';
import { SectionHeading } from '@/components/ui/primitives';
import { getToolCategories, getTools } from '@/lib/content';
import { filterTools, groupByCategory } from '@/lib/tools';
import { useState } from 'react';

const ALL = 'All';

export function ToolsExplorer() {
  const tools = getTools();
  const categories = getToolCategories();
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');

  const filtered = filterTools(tools.items, category, query);
  const groups = groupByCategory(filtered, categories);

  const clearFilters = () => {
    setCategory(ALL);
    setQuery('');
  };

  return (
    <section className='pt-10 pb-16 md:pt-14 md:pb-24'>
      <div className='container px-6'>
        <Reveal>
          <SectionHeading title={tools.title} subtitle={tools.subtitle} className='mb-8' />
        </Reveal>

        <ToolsToolbar
          categories={categories}
          category={category}
          query={query}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          count={filtered.length}
        />

        {groups.length > 0 ? (
          <div className='mt-6 space-y-8'>
            {groups.map(group => (
              <ToolGroup
                key={group.category}
                category={group.category}
                items={group.items}
              />
            ))}
          </div>
        ) : (
          <div className='mt-6'>
            <ToolsEmptyState query={query} onClear={clearFilters} />
          </div>
        )}
      </div>
    </section>
  );
}
