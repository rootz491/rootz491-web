import { getSiteConfig } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

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
          <div className='max-w-3xl mx-auto prose prose-slate'>
            <h1>Privacy Policy</h1>
            <p className='lead'>
              {site.brand.name} is committed to protecting your privacy and
              personal data.
            </p>

            <h2>Information We Collect</h2>
            <p>When you contact us or use our services, we may collect:</p>
            <ul>
              <li>Name and contact information (email, phone)</li>
              <li>Organization details</li>
              <li>Project requirements and communications</li>
              <li>Technical logs and usage data</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to inquiries and provide services</li>
              <li>Improve our offerings and website</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Protection</h2>
            <p>
              We implement appropriate security measures to protect your data
              including encryption, access controls, and regular security
              assessments.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Opt-out of communications</li>
            </ul>

            <h2>Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{' '}
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
