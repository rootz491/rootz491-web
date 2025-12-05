import { getSiteConfig } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { CheckCircle } from 'lucide-react';

export const metadata = generateMetadata({
  title: 'Terms of Service',
  path: '/legal/terms',
});

export default function TermsPage() {
  const site = getSiteConfig();

  return (
    <div className='flex flex-col'>
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-8'>Terms of Service</h1>

            <div className='prose prose-slate max-w-none'>
              <h2 className='text-2xl font-bold mb-4'>Agreement to Terms</h2>
              <p className='mb-8'>
                By accessing or using {site.brand.name}'s services, you agree to
                be bound by these terms and conditions.
              </p>

              <h2 className='text-2xl font-bold mb-4'>Services</h2>
              <p className='mb-8'>
                We provide software development, DevOps, and maintenance
                services as outlined in individual proposals and contracts.
              </p>

              <h2 className='text-2xl font-bold mb-4'>
                Client Responsibilities
              </h2>
              <ul className='space-y-2 mb-8'>
                {[
                  'Provide accurate project requirements',
                  'Timely feedback and approvals',
                  'Access to necessary systems and documentation',
                  'Timely payment as per agreed terms',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>Intellectual Property</h2>
              <p className='mb-8'>
                Unless otherwise specified in the contract, deliverables become
                client property upon full payment. We retain the right to
                showcase work (with permission) in our portfolio.
              </p>

              <h2 className='text-2xl font-bold mb-4'>Confidentiality</h2>
              <p className='mb-8'>
                We maintain strict confidentiality of all client information and
                will sign NDAs as required.
              </p>

              <h2 className='text-2xl font-bold mb-4'>
                Limitation of Liability
              </h2>
              <p className='mb-8'>
                Our liability is limited to the contract value. We are not
                liable for indirect or consequential damages.
              </p>

              <h2 className='text-2xl font-bold mb-4'>Contact</h2>
              <p>
                For questions about these terms, contact{' '}
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
