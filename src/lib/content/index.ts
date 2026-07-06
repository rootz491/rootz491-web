import aboutData from '../../../content/about.json';
import contactData from '../../../content/contact.json';
import experienceData from '../../../content/experience.json';
import profileData from '../../../content/profile.json';
import projectsData from '../../../content/projects.json';
import servicesData from '../../../content/services.json';
import siteData from '../../../content/site.json';
import skillsData from '../../../content/skills.json';
import {
  AboutSchema,
  ContactSchema,
  ExperienceSchema,
  ProfileSchema,
  ProjectsSchema,
  ServicesSchema,
  SiteSchema,
  SkillsSchema,
  type AboutContent,
  type ContactContent,
  type ExperienceContent,
  type ProfileContent,
  type Project,
  type ProjectsContent,
  type ServicesContent,
  type SiteContent,
  type SkillsContent,
} from './types';

let cache: {
  site: SiteContent;
  profile: ProfileContent;
  about: AboutContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  experience: ExperienceContent;
  services: ServicesContent;
  contact: ContactContent;
} | null = null;

function loadAll() {
  if (cache) return cache;

  cache = {
    site: SiteSchema.parse(siteData),
    profile: ProfileSchema.parse(profileData),
    about: AboutSchema.parse(aboutData),
    skills: SkillsSchema.parse(skillsData),
    projects: ProjectsSchema.parse(projectsData),
    experience: ExperienceSchema.parse(experienceData),
    services: ServicesSchema.parse(servicesData),
    contact: ContactSchema.parse(contactData),
  };

  return cache;
}

export function getSite(): SiteContent {
  return loadAll().site;
}

export function getProfile(): ProfileContent {
  return loadAll().profile;
}

export function getAbout(): AboutContent {
  return loadAll().about;
}

export function getSkills(): SkillsContent {
  return loadAll().skills;
}

export function getProjects(): ProjectsContent {
  return loadAll().projects;
}

export function getProjectBySlug(slug: string): Project | null {
  return getProjects().items.find(p => p.slug === slug) ?? null;
}

export function getAllProjectSlugs(): string[] {
  return getProjects().items.map(p => p.slug);
}

export function getExperience(): ExperienceContent {
  return loadAll().experience;
}

export function getServices(): ServicesContent {
  return loadAll().services;
}

export function getContact(): ContactContent {
  return loadAll().contact;
}
