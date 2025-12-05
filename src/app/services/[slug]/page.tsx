import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAllServiceSlugs,
  getPageContent,
  getServiceBySlug,
} from '@/lib/content';
import { generateMetadata as genMeta } from '@/lib/seo';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return genMeta({
    title: `${service.title} — ROOTZ491`,
    description: service.summary,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const workPage = getPageContent('/work');

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <Badge className='mb-4'>Service</Badge>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4'>
              {service.title}
            </h1>
            <p className='text-xl text-muted-foreground'>{service.summary}</p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>The Challenge</h2>
              <p className='text-lg text-muted-foreground'>{service.problem}</p>
            </div>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Our Approach</h2>
              <ul className='space-y-3'>
                {service.solution.map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-muted-foreground'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables & Stack */}
      <section className='py-20 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto'>
            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {service.stack.map((tech, idx) => (
                    <Badge key={idx} variant='secondary'>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {service.caseStudies && service.caseStudies.length > 0 && (
        <section className='py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold tracking-tighter mb-8'>
              Related Work
            </h2>
            <div className='grid gap-6 md:grid-cols-2 max-w-4xl'>
              {service.caseStudies.slice(0, 2).map((caseSlug, idx) => {
                const work = workPage.items.find(w => w.slug === caseSlug);
                if (!work) return null;
                return (
                  <Link key={idx} href={`/work/${work.slug}`} className='group'>
                    <Card className='border-2 hover:border-primary transition-colors'>
                      <CardHeader>
                        <CardTitle className='group-hover:text-primary transition-colors'>
                          {work.title}
                        </CardTitle>
                        <p className='text-muted-foreground'>{work.summary}</p>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className='py-20 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Ready to get started?
            </h2>
            <p className='text-lg'>
              Let's discuss how we can help with your{' '}
              {service.title.toLowerCase()} needs.
            </p>
            <Button asChild size='lg' variant='secondary'>
              <Link
                href={service.cta.href}
                className='inline-flex items-center'
              >
                {service.cta.label} <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
