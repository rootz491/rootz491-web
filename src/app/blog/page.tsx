import { BlogsSection } from '@/components/sections/BlogsSection';
import { getBlogs } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Blog',
  description: getBlogs().subtitle,
  path: '/blog',
});

export default function BlogPage() {
  return (
    <div className='pt-8'>
      <BlogsSection />
    </div>
  );
}
