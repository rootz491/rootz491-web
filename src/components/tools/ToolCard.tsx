'use client';

import { ToolActions } from '@/components/tools/ToolActions';
import { ToolIcon } from '@/components/tools/ToolIcon';
import type { Tool } from '@/lib/content/types';
import { toolHost, toolPath } from '@/lib/tools';

export function ToolCard({
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
    <article className='group relative flex h-full min-h-11 gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors duration-150 ease-out pointer-hover:border-border-strong pointer-hover:bg-surface-hover has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-cream has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background'>
      <ToolIcon icon={tool.icon} name={tool.name} />

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <a
            href={tool.url}
            target='_blank'
            rel='noopener noreferrer'
            className="min-w-0 truncate text-[15px] font-semibold leading-6 text-cream focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 after:absolute after:inset-0 after:rounded-xl after:content-[''] sm:text-base"
          >
            {tool.name}
            <span className='sr-only'> (opens in a new tab)</span>
          </a>

          <ToolActions
            name={tool.name}
            url={tool.url}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onToast={onToast}
          />
        </div>

        <div className='truncate font-mono text-[12.5px] leading-5 text-cream-muted'>
          {host}
          {path && <span className='text-cream-muted/70'>{path}</span>}
        </div>

        <p className='mt-1 line-clamp-2 text-[13px] leading-5 text-cream-muted sm:min-h-10'>
          {tool.description}
        </p>
      </div>
    </article>
  );
}
