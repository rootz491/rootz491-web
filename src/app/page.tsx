import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      <HeroSection preview />
      <AboutSection preview />
      <SkillsSection preview />
      <ProjectsSection preview />
      <ExperienceSection preview />
      <ServicesSection preview />
      <ContactSection preview />
    </>
  );
}
