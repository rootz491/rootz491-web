'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export type ToastMessage = { id: number; text: string };

export function Toast({ toast }: { toast: ToastMessage }) {
  const [shown, setShown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast.text) return;

    setShown(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShown(false), 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast]);

  return (
    <div
      role='status'
      aria-live='polite'
      className='pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]'
    >
      <div
        className={cn(
          'rounded-[10px] border border-border-strong bg-surface-elevated px-3 py-2 text-sm text-cream shadow-lg transition-[opacity,transform] duration-150 ease-out',
          shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        )}
      >
        {toast.text}
      </div>
    </div>
  );
}
