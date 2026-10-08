import Link from 'next/link';

export function SkipLink() {
  return (
    <Link
      href='#main'
      className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-cream focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-background focus:shadow-lg'
    >
      Skip to content
    </Link>
  );
}
