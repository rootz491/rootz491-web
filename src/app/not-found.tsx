import { Button } from '@/components/ui/primitives';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Not found — Karan Sharma' },
};

export default function NotFound() {
  return (
    <section className='flex min-h-[60vh] items-center section-spacing'>
      <div className='container px-6'>
        <div className='mx-auto flex max-w-2xl flex-col items-center text-center'>
          <p className='text-sm font-medium uppercase tracking-wider text-cream-muted'>404</p>
          <h1 className='mt-4 text-h1 text-cream'>Page not found</h1>
          <p className='mt-4 text-base text-cream-muted'>
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Button href='/' className='mt-8'>
            Back home
          </Button>
        </div>
      </div>
    </section>
  );
}
