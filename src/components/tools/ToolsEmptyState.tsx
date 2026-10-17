export function ToolsEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  const trimmedQuery = query.trim();

  return (
    <div className='rounded-xl border border-border bg-surface p-8 text-center'>
      <p className='text-sm text-cream-muted'>
        {trimmedQuery ? 'No tools match this search' : 'No tools in this category'}
      </p>
      <button
        type='button'
        onClick={onClear}
        className='mt-4 inline-flex min-h-11 items-center justify-center rounded-[10px] border border-border px-4 text-sm text-cream-muted transition-colors duration-150 pointer-hover:border-border-strong pointer-hover:text-cream'
      >
        Clear filters
      </button>
    </div>
  );
}
