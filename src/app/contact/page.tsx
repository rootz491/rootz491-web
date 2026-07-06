import { ContactSection } from '@/components/sections/ContactSection';
import { getContact } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Contact',
  description: getContact().subtitle,
  path: '/contact',
});

export default function ContactPage() {
  return <ContactSection />;
}
