import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { getAbout } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'About',
  description: getAbout().intro,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <div id='skills'>
        <SkillsSection />
      </div>
      <div id='experience'>
        <ExperienceSection />
      </div>
    </>
  );
}
