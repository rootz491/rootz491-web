import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPageContent, getSharedContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  Cloud,
  Globe,
  Server,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = generateMetadata({
  path: '/',
});

const iconMap = {
  globe: Globe,
  server: Server,
  cloud: Cloud,
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
};

export default function HomePage() {
  const page = getPageContent('/');
  const shared = getSharedContent();
  const {
    hero,
    serviceHighlights,
    govtFocus,
    workPreview,
    testimonials,
    ctaBanner,
  } = page;

  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-12 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-8 lg:grid-cols-2 lg:gap-12 items-center'>
            <div className='space-y-6'>
              {/* Badges */}
              <div className='flex flex-wrap gap-2'>
                {hero.badges.map((badge, idx) => (
                  <Badge key={idx} variant='secondary'>
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
                {hero.title}
              </h1>

              {/* Subtitle */}
              <p className='text-xl text-muted-foreground max-w-2xl'>
                {hero.subtitle}
              </p>

              {/* CTAs */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button asChild size='lg'>
                  <Link
                    href={hero.primaryCta.href}
                    className='inline-flex items-center'
                  >
                    {hero.primaryCta.label}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                  <Link href={hero.secondaryCta.href}>
                    {hero.secondaryCta.label}
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-3 gap-4 pt-4'>
                {hero.stats.map((stat, idx) => (
                  <div key={idx} className='space-y-1'>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                    <div className='text-sm text-muted-foreground'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className='relative aspect-square lg:aspect-auto lg:h-[600px] rounded-lg overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop&q=85'
                alt='Modern developer workspace with code'
                fill
                className='object-cover'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent' />
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              {serviceHighlights.title}
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              {serviceHighlights.subtitle}
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {serviceHighlights.items.map((service, idx) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] || Globe;
              return (
                <Card
                  key={idx}
                  className='border-2 hover:border-primary transition-colors'
                >
                  <CardHeader>
                    <div className='mb-4'>
                      <Icon className='h-10 w-10 text-primary' />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className='text-base'>
                      {service.desc}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Government Focus */}
      <section className='py-20 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              {govtFocus.title}
            </h2>
            <p className='text-lg text-muted-foreground max-w-3xl mx-auto'>
              {govtFocus.paragraph}
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3 max-w-5xl mx-auto'>
            {govtFocus.cards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className='text-xl'>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>{card.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Work Preview */}
      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              {workPreview.title}
            </h2>
            <Button asChild variant='outline'>
              <Link href='/work' className='inline-flex items-center'>
                View all work <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {workPreview.items.map((work, idx) => {
              // Using Creazilla website screenshot-style image
              const image =
                'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=720&fit=crop&q=85';
              return (
                <Link key={idx} href={`/work/${work.slug}`} className='group'>
                  <Card className='overflow-hidden border-2 hover:border-primary transition-colors'>
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

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className='py-20 bg-muted/40'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto'>
              <div className='grid gap-8 md:grid-cols-1'>
                {testimonials.map((testimonial, idx) => (
                  <Card key={idx} className='border-2'>
                    <CardContent className='pt-6'>
                      <blockquote className='space-y-4'>
                        <p className='text-lg italic'>"{testimonial.quote}"</p>
                        <footer className='flex items-center gap-4'>
                          <div>
                            <div className='font-semibold'>
                              {testimonial.name}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {testimonial.role}
                            </div>
                          </div>
                        </footer>
                      </blockquote>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className='py-20 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              {ctaBanner.title}
            </h2>
            <Button asChild size='lg' variant='secondary'>
              <Link
                href={ctaBanner.cta.href}
                className='inline-flex items-center'
              >
                {ctaBanner.cta.label}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
