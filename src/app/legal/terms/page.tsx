import { getSiteConfig } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

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
          <div className='max-w-3xl mx-auto prose prose-slate'>
            <h1>Terms of Service</h1>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using {site.brand.name}'s services, you agree to
              be bound by these terms and conditions.
            </p>

            <h2>Services</h2>
            <p>
              We provide software development, DevOps, and maintenance services
              as outlined in individual proposals and contracts.
            </p>

            <h2>Client Responsibilities</h2>
            <ul>
              <li>Provide accurate project requirements</li>
              <li>Timely feedback and approvals</li>
              <li>Access to necessary systems and documentation</li>
              <li>Timely payment as per agreed terms</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              Unless otherwise specified in the contract, deliverables become
              client property upon full payment. We retain the right to showcase
              work (with permission) in our portfolio.
            </p>

            <h2>Confidentiality</h2>
            <p>
              We maintain strict confidentiality of all client information and
              will sign NDAs as required.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Our liability is limited to the contract value. We are not liable
              for indirect or consequential damages.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these terms, contact{' '}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </p>

            <p className='text-sm text-muted-foreground mt-8'>
              Last updated: December 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
