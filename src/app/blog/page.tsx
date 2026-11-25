import { BlogsSection } from '@/components/sections/BlogsSection';
import { getBlogs } from '@/lib/content';
import { getOwnBlogPosts } from '@/lib/ownBlogFeed.server';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Blog',
  description: getBlogs().subtitle,
  path: '/blog',
});

// Next.js requires a literal here. Keep it equal to OWN_BLOG_REVALIDATE_SECONDS.
export const revalidate = 3600;

export default async function BlogPage() {
  const ownBlogPosts = await getOwnBlogPosts();

  return (
    <div className='pt-8'>
      <BlogsSection headingAs='h1' ownBlogPosts={ownBlogPosts} />
    </div>
  );
}
