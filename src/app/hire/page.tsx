import { HireSection } from '@/components/sections/HireSection';
import { getHire } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

const hire = getHire();

export const metadata = generateMetadata({
  title: 'Hire me',
  description: `${hire.intro} Based in ${hire.location}.`,
  path: '/hire',
});

export default function HirePage() {
  return (
    <div className='pt-8'>
      <HireSection headingAs='h1' />
    </div>
  );
}
