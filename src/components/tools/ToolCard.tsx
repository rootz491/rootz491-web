import { ToolIcon } from '@/components/tools/ToolIcon';
import type { Tool } from '@/lib/content/types';
import { toolHost, toolPath } from '@/lib/tools';
import { ArrowUpRight } from 'lucide-react';

export function ToolCard({ tool }: { tool: Tool }) {
  const host = toolHost(tool.url);
  const path = toolPath(tool.url);

  return (
    <a
      href={tool.url}
      target='_blank'
      rel='noopener noreferrer'
      className='group relative flex h-full min-h-11 gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors duration-150 ease-out pointer-hover:border-border-strong pointer-hover:bg-surface-hover active:bg-surface-hover'
    >
      <ToolIcon icon={tool.icon} name={tool.name} />

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='min-w-0 truncate text-[15px] font-semibold leading-6 text-cream sm:text-base'>
            {tool.name}
          </span>
          <ArrowUpRight
            className='ml-auto h-3.5 w-3.5 shrink-0 text-cream-muted'
            aria-hidden='true'
          />
        </div>

        <div className='truncate font-mono text-[12.5px] leading-5 text-cream-muted'>
          {host}
          {path && <span className='text-cream-muted/70'>{path}</span>}
        </div>

        <p className='mt-1 line-clamp-2 sm:min-h-10 text-[13px] leading-5 text-cream-muted'>
          {tool.description}
        </p>
      </div>

      <span className='sr-only'>(opens in a new tab)</span>
    </a>
  );
}
