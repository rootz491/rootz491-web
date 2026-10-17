'use client';

import { ToolActions } from '@/components/tools/ToolActions';
import { ToolIcon } from '@/components/tools/ToolIcon';
import type { Tool } from '@/lib/content/types';
import { toolHost, toolPath } from '@/lib/tools';

export function ToolRow({
  tool,
  isFavorite,
  onToggleFavorite,
  onToast,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToast: (message: string) => void;
}) {
  const host = toolHost(tool.url);
  const path = toolPath(tool.url);

  return (
    <li className='pointer-hover:bg-surface-hover first:rounded-t-xl last:rounded-b-xl'>
      <article className='group relative flex items-center gap-3 px-3.5 py-3 transition-colors duration-150 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-cream has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background'>
        <ToolIcon icon={tool.icon} name={tool.name} />

        <div className='min-w-0 flex-1'>
          <a
            href={tool.url}
            target='_blank'
            rel='noopener noreferrer'
            className="block truncate text-sm font-medium leading-5 text-cream focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 after:absolute after:inset-0 after:content-['']"
          >
            {tool.name}
            <span className='sr-only'> (opens in a new tab)</span>
          </a>

          <div className='truncate font-mono text-[12.5px] leading-5 text-cream-muted'>
            {host}
            {path && <span className='text-cream-muted/70'>{path}</span>}
          </div>

          <p className='mt-0.5 line-clamp-2 text-[13px] leading-5 text-cream-muted md:hidden'>
            {tool.description}
          </p>
        </div>

        <p className='hidden w-[42%] shrink-0 line-clamp-2 text-[13px] leading-5 text-cream-muted md:block'>
          {tool.description}
        </p>

        <span className='hidden w-28 shrink-0 truncate text-xs text-cream-muted lg:block'>
          {tool.category}
        </span>

        <ToolActions
          name={tool.name}
          url={tool.url}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onToast={onToast}
        />
      </article>
    </li>
  );
}
