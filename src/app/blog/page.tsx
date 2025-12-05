import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Blog & Insights',
  path: '/blog',
});

export default function BlogPage() {
  const page = getPageContent('/blog');
  const { title, intro, posts } = page;

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

      {/* Posts */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto space-y-8'>
            {posts.map((post, idx) => (
              <Card
                key={idx}
                className='overflow-hidden hover:border-primary transition-colors'
              >
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='aspect-video md:aspect-square bg-muted'></div>
                  <div className='md:col-span-2 p-6 md:py-6 md:pr-6 md:pl-0'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
                      <Calendar className='h-4 w-4' />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <h2 className='text-2xl font-bold mb-3'>
                      <Link
                        href={`/blog/${post.slug}`}
                        className='hover:text-primary'
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className='text-muted-foreground mb-4'>{post.excerpt}</p>
                    <div className='flex flex-wrap gap-2'>
                      {post.tags.map((tag, tidx) => (
                        <Badge key={tidx} variant='secondary'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
