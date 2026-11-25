import { BlogsSection } from '@/components/sections/BlogsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { getOwnBlogPosts } from '@/lib/ownBlogFeed.server';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({ path: '/' });

// Next.js requires a literal here. Keep it equal to OWN_BLOG_REVALIDATE_SECONDS.
export const revalidate = 3600;

export default async function HomePage() {
  const ownBlogPosts = await getOwnBlogPosts();

  return (
    <>
      <HeroSection preview />
      <AboutSection preview />
      <SkillsSection preview />
      <ProjectsSection preview />
      <ExperienceSection preview />
      <BlogsSection preview ownBlogPosts={ownBlogPosts} />
      <ServicesSection preview />
      <ContactSection preview />
    </>
  );
}
