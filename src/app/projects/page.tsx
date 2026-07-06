import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { getProjects } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Projects',
  description: getProjects().subtitle,
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <div className='pt-8'>
      <ProjectsSection />
    </div>
  );
}
