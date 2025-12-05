import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { ArrowRight, CheckCircle, Download, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Government & PSU Solutions',
  path: '/government',
});

export default function GovernmentPage() {
  const page = getPageContent('/government');
  const { title, badges, procurement, compliance, security, documents, cta } =
    page;

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <div className='flex flex-wrap gap-2 mb-4'>
              {badges.map((badge, idx) => (
                <Badge key={idx} variant='secondary'>
                  <ShieldCheck className='h-3 w-3 mr-1' />
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4'>
              {title}
            </h1>
            <p className='text-xl text-muted-foreground'>
              Registered, compliant, and experienced in public sector delivery
            </p>
          </div>
        </div>
      </section>

      {/* Procurement */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-3xl font-bold mb-8'>
              Procurement & Onboarding
            </h2>
            <div className='grid gap-8 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Platforms We Work With</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {procurement.platforms.map((platform, idx) => (
                      <li key={idx} className='flex items-start gap-2'>
                        <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                        <span>{platform}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Procurement Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {procurement.modes.map((mode, idx) => (
                      <li key={idx} className='flex items-start gap-2'>
                        <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                        <span>{mode}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Security */}
      <section className='py-20 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <div className='grid gap-12 lg:grid-cols-2'>
              <div>
                <h2 className='text-2xl font-bold mb-6'>
                  Compliance Standards
                </h2>
                <ul className='space-y-3'>
                  {compliance.map((item, idx) => (
                    <li
                      key={idx}
                      className='flex items-start gap-2 text-muted-foreground'
                    >
                      <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-6'>Security Practices</h2>
                <ul className='space-y-3'>
                  {security.map((item, idx) => (
                    <li
                      key={idx}
                      className='flex items-start gap-2 text-muted-foreground'
                    >
                      <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold mb-8'>Required Documents</h2>
            <div className='grid gap-4 sm:grid-cols-2'>
              {documents.map((doc, idx) => (
                <Card key={idx}>
                  <CardContent className='pt-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <Download className='h-5 w-5 text-primary' />
                        <span className='font-medium'>{doc.label}</span>
                      </div>
                      <Button asChild variant='ghost' size='sm'>
                        <a
                          href={doc.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Download className='h-4 w-4' />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Have an RFP or project scope?
            </h2>
            <p className='text-lg'>
              We're ready to respond with technical & commercial proposals.
            </p>
            <Button asChild size='lg' variant='secondary'>
              <Link href={cta.href} className='inline-flex items-center'>
                {cta.label} <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
