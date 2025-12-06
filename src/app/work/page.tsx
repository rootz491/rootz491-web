import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import Image from 'next/image';
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
            {items.map((work, idx) => {
              // Using Creazilla-appropriate image
              const image =
                'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=720&fit=crop&q=85';
              return (
                <Link key={idx} href={work.href} className='group'>
                  <Card className='overflow-hidden border-2 hover:border-primary transition-colors h-full'>
                    <div className='aspect-video relative overflow-hidden bg-muted'>
                      <Image
                        src={image}
                        alt={work.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className='group-hover:text-primary transition-colors'>
                        {work.title}
                      </CardTitle>
                      <CardDescription>{work.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
