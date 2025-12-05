import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { Server } from 'lucide-react';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Work & Case Studies',
  path: '/work',
});

export default function WorkPage() {
  const page = getPageContent('/work');
  const { title, intro, items } = page;

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4'>
              {title}
            </h1>
            <p className='text-xl text-muted-foreground'>{intro}</p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {items.map((work, idx) => (
              <Link key={idx} href={work.href} className='group'>
                <Card className='overflow-hidden border-2 hover:border-primary transition-colors h-full'>
                  <div className='aspect-video bg-muted relative overflow-hidden'>
                    <div className='absolute inset-0 flex items-center justify-center text-muted-foreground'>
                      <Server className='h-16 w-16 opacity-20' />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className='group-hover:text-primary transition-colors'>
                      {work.title}
                    </CardTitle>
                    <CardDescription>{work.summary}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
