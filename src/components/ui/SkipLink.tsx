import Link from 'next/link';

export function SkipLink() {
  return (
    <Link
      href='#main'
      className='fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-md bg-cream px-4 py-2 text-xs font-medium text-background shadow-lg transition-transform focus:translate-y-0 motion-reduce:transition-none'
    >
      Skip to content
    </Link>
  );
}
