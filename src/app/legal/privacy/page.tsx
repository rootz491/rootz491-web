import { getSiteConfig } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { CheckCircle } from 'lucide-react';

export const metadata = generateMetadata({
  title: 'Privacy Policy',
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  const site = getSiteConfig();

  return (
    <div className='flex flex-col'>
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-8'>Privacy Policy</h1>

            <div className='prose prose-slate max-w-none'>
              <p className='text-lg text-muted-foreground mb-8'>
                {site.brand.name} is committed to protecting your privacy and
                personal data.
              </p>

              <h2 className='text-2xl font-bold mb-4'>
                Information We Collect
              </h2>
              <p className='mb-4'>
                When you contact us or use our services, we may collect:
              </p>
              <ul className='space-y-2 mb-8'>
                {[
                  'Name and contact information (email, phone)',
                  'Organization details',
                  'Project requirements and communications',
                  'Technical logs and usage data',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>
                How We Use Your Information
              </h2>
              <p className='mb-4'>We use collected information to:</p>
              <ul className='space-y-2 mb-8'>
                {[
                  'Respond to inquiries and provide services',
                  'Improve our offerings and website',
                  'Comply with legal obligations',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>Data Protection</h2>
              <p className='mb-8'>
                We implement appropriate security measures to protect your data
                including encryption, access controls, and regular security
                assessments.
              </p>

              <h2 className='text-2xl font-bold mb-4'>Your Rights</h2>
              <p className='mb-4'>You have the right to:</p>
              <ul className='space-y-2 mb-8'>
                {[
                  'Access your personal data',
                  'Request correction or deletion',
                  'Opt-out of communications',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>Contact</h2>
              <p>
                For privacy-related inquiries, contact us at{' '}
                <a
                  href={`mailto:${site.contact.email}`}
                  className='text-primary hover:underline'
                >
                  {site.contact.email}
                </a>
              </p>

              <p className='text-sm text-muted-foreground mt-8'>
                Last updated: December 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
