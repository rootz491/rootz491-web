import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Services — Full-stack, DevOps & AMC',
  path: '/services',
});

export default function ServicesPage() {
  const page = getPageContent('/services');
  const { title, intro, groups, plans } = page;

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

      {/* Service Groups */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='space-y-16'>
            {groups.map((group, gidx) => (
              <div key={gidx}>
                <h2 className='text-2xl font-bold mb-8'>{group.title}</h2>
                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                  {group.items.map((service, sidx) => (
                    <Card
                      key={sidx}
                      className='border-2 hover:border-primary transition-colors'
                    >
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                        <CardDescription className='text-base'>
                          {service.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className='space-y-2 mb-4'>
                          {service.bullets.map((bullet, bidx) => (
                            <li
                              key={bidx}
                              className='flex items-start gap-2 text-sm'
                            >
                              <CheckCircle className='h-4 w-4 text-primary shrink-0 mt-0.5' />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <Button asChild variant='link' className='px-0'>
                          <Link
                            href={service.href}
                            className='inline-flex items-center'
                          >
                            Learn more <ArrowRight className='ml-1 h-4 w-4' />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Plans */}
      <section className='py-20 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl mb-4'>
              Maintenance (AMC) Plans
            </h2>
            <p className='text-xl text-muted-foreground'>
              Choose the right support level for your needs
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3 max-w-5xl mx-auto'>
            {plans.map((plan, pidx) => (
              <Card
                key={pidx}
                className={
                  pidx === 1 ? 'border-primary border-2 shadow-lg' : ''
                }
              >
                <CardHeader>
                  <div className='flex items-center justify-between mb-2'>
                    <CardTitle className='text-2xl'>{plan.name}</CardTitle>
                    {pidx === 1 && <Badge>Popular</Badge>}
                  </div>
                  <div className='text-3xl font-bold'>{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className='flex items-start gap-2'>
                        <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className='w-full mt-6'>
                    <Link href='/contact'>Get Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-6 bg-primary/10 rounded-lg p-12'>
            <h2 className='text-3xl font-bold tracking-tighter'>
              Need a custom solution?
            </h2>
            <p className='text-lg text-muted-foreground'>
              Share your requirements and we'll provide a tailored proposal.
            </p>
            <Button asChild size='lg'>
              <Link href='/contact' className='inline-flex items-center'>
                Request Proposal <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
