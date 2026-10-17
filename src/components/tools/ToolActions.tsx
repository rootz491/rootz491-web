'use client';

import { cn } from '@/lib/utils';
import { Copy, Star } from 'lucide-react';

const actionButton =
  'inline-flex h-11 w-11 items-center justify-center rounded-[9px] text-cream-muted transition-[color,background-color,opacity] duration-150 pointer-hover:bg-surface-elevated pointer-hover:text-cream [@media(pointer:fine)]:h-8 [@media(pointer:fine)]:w-8';

const reveal =
  '[@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 group-focus-within:opacity-100';

export function ToolActions({
  name,
  url,
  isFavorite,
  onToggleFavorite,
  onToast,
}: {
  name: string;
  url: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToast: (message: string) => void;
}) {
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onToast('URL copied');
    } catch {
      onToast("Couldn't copy URL");
    }
  };

  return (
    <div className='relative z-10 ml-auto flex shrink-0 items-center gap-0.5'>
      <button
        type='button'
        data-fav-url={url}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`
        }
        onClick={onToggleFavorite}
        className={cn(actionButton, !isFavorite && reveal)}
      >
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-current text-cream')}
          aria-hidden='true'
        />
      </button>

      <button
        type='button'
        aria-label={`Copy ${name} URL`}
        onClick={copyUrl}
        className={cn(actionButton, reveal)}
      >
        <Copy className='h-4 w-4' aria-hidden='true' />
      </button>
    </div>
  );
}
