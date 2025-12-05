import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllWorkSlugs, getWorkBySlug } from '@/lib/content';
import { generateMetadata as genMeta } from '@/lib/seo';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllWorkSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};

  return genMeta({
    title: `${work.title} — Case Study`,
    description: work.summary,
    path: `/work/${slug}`,
  });
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl'>
            <Button asChild variant='ghost' className='mb-4'>
              <Link href='/work'>
                <ArrowLeft className='mr-2 h-4 w-4' /> Back to Work
              </Link>
            </Button>
            <Badge className='mb-4'>{work.client.sector}</Badge>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4'>
              {work.title}
            </h1>
            <p className='text-xl text-muted-foreground'>{work.summary}</p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className='py-12 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            {work.kpis.map((kpi, idx) => (
              <div key={idx} className='text-center'>
                <div className='text-3xl md:text-4xl font-bold mb-2'>
                  {kpi.value}
                </div>
                <div className='text-sm opacity-90'>{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge & Approach */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto grid gap-12 lg:grid-cols-2'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>The Challenge</h2>
              <p className='text-lg text-muted-foreground'>{work.challenge}</p>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Our Approach</h2>
              <ul className='space-y-3'>
                {work.approach.map((step, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className='py-12 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-2xl font-bold mb-6'>Technology Stack</h2>
            <div className='flex flex-wrap gap-2'>
              {work.stack.map((tech, idx) => (
                <Badge
                  key={idx}
                  variant='secondary'
                  className='text-sm px-3 py-1'
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {work.testimonial && (
        <section className='py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl mx-auto'>
              <Card className='border-2'>
                <CardContent className='pt-6'>
                  <blockquote className='space-y-4'>
                    <p className='text-lg italic'>"{work.testimonial.quote}"</p>
                    <footer>
                      <div className='font-semibold'>
                        {work.testimonial.name}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {work.testimonial.role}
                      </div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
