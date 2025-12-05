import { getSiteConfig } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { CheckCircle } from 'lucide-react';

export const metadata = generateMetadata({
  title: 'Security Policy',
  path: '/legal/security',
});

export default function SecurityPage() {
  const site = getSiteConfig();

  return (
    <div className='flex flex-col'>
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-8'>Security Policy</h1>

            <div className='prose prose-slate max-w-none'>
              <p className='text-lg text-muted-foreground mb-8'>
                Security is foundational to our development and operations
                practices.
              </p>

              <h2 className='text-2xl font-bold mb-4'>Development Security</h2>
              <ul className='space-y-2 mb-8'>
                {[
                  'OWASP Top 10 coverage in all applications',
                  'Secure coding guidelines and peer reviews',
                  'Dependency scanning and updates',
                  'Secret management (no hardcoded credentials)',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>
                Infrastructure Security
              </h2>
              <ul className='space-y-2 mb-8'>
                {[
                  'Encryption in transit (TLS 1.2+) and at rest',
                  'Least-privilege access controls',
                  'Regular security patches and updates',
                  'Network segmentation and firewalls',
                  'Centralized logging and monitoring',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>Compliance</h2>
              <ul className='space-y-2 mb-8'>
                {[
                  'VAPT remediation within SLA timelines',
                  'Audit trail maintenance',
                  'Data backup and disaster recovery',
                  'Incident response procedures',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className='text-2xl font-bold mb-4'>
                Reporting Security Issues
              </h2>
              <p>
                If you discover a security vulnerability, please report it
                immediately to{' '}
                <a
                  href={`mailto:${site.contact.email}?subject=Security Issue`}
                  className='text-primary hover:underline'
                >
                  {site.contact.email}
                </a>
                . We appreciate responsible disclosure and will respond
                promptly.
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
