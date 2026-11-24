import blogsData from '../../../content/blogs.json';
import aboutData from '../../../content/about.json';
import contactData from '../../../content/contact.json';
import experienceData from '../../../content/experience.json';
import hireData from '../../../content/hire.json';
import profileData from '../../../content/profile.json';
import projectsData from '../../../content/projects.json';
import servicesData from '../../../content/services.json';
import siteData from '../../../content/site.json';
import skillsData from '../../../content/skills.json';
import toolsData from '../../../content/tools.json';
import {
  BlogsSchema,
  AboutSchema,
  ContactSchema,
  ExperienceSchema,
  HireSchema,
  ProfileSchema,
  ProjectsSchema,
  ServicesSchema,
  SiteSchema,
  SkillsSchema,
  ToolsSchema,
  type BlogsContent,
  type AboutContent,
  type ContactContent,
  type ExperienceContent,
  type HireContent,
  type ProfileContent,
  type Project,
  type ProjectsContent,
  type ServicesContent,
  type SiteContent,
  type SkillsContent,
  type Tool,
  type ToolCategory,
  type ToolsContent,
} from './types';

let cache: {
  site: SiteContent;
  profile: ProfileContent;
  about: AboutContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  tools: ToolsContent;
  experience: ExperienceContent;
  services: ServicesContent;
  contact: ContactContent;
  blogs: BlogsContent;
  hire: HireContent;
} | null = null;

function loadAll() {
  if (cache) return cache;

  cache = {
    site: SiteSchema.parse(siteData),
    profile: ProfileSchema.parse(profileData),
    about: AboutSchema.parse(aboutData),
    skills: SkillsSchema.parse(skillsData),
    projects: ProjectsSchema.parse(projectsData),
    tools: ToolsSchema.parse(toolsData),
    experience: ExperienceSchema.parse(experienceData),
    services: ServicesSchema.parse(servicesData),
    contact: ContactSchema.parse(contactData),
    blogs: BlogsSchema.parse(blogsData),
    hire: HireSchema.parse(hireData),
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

export function getTools(): ToolsContent {
  return loadAll().tools;
}

export function getToolCategories(): ToolCategory[] {
  return Array.from(new Set(getTools().items.map(t => t.category)));
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

export function getBlogs(): BlogsContent {
  return loadAll().blogs;
}

export function getHire(): HireContent {
  return loadAll().hire;
}
