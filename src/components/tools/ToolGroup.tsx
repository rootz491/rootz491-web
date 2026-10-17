import { ToolCard } from '@/components/tools/ToolCard';
import type { Tool } from '@/lib/content/types';

export function ToolGroup({
  category,
  items,
}: {
  category: string;
  items: Tool[];
}) {
  const headingId = `tools-group-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className='text-xs font-semibold uppercase tracking-[0.08em] text-cream-muted'
      >
        {category} <span className='tabular-nums'>{items.length}</span>
      </h3>
      <ul
        role='list'
        className='mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      >
        {items.map(tool => (
          <li key={tool.slug} className='min-w-0'>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>
    </section>
  );
}
