import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/primitives';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content';
import { generateMetadata as genMeta } from '@/lib/seo';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getAllProjectSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return genMeta({
    title: project.title,
    description: project.summary,
    path: `/projects/${slug}`,
    ogImage: project.thumb,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className='py-16 md:py-24'>
      <div className='container px-6 max-w-4xl'>
        <Reveal>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream mb-8 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to projects
          </Link>

          <p className='text-sm font-medium uppercase tracking-wider text-cream-muted mb-3'>
            {project.role}
          </p>
          <h1 className='text-4xl md:text-5xl font-black text-cream mb-4'>{project.title}</h1>
          <p className='text-lg text-cream-muted leading-relaxed mb-8'>{project.summary}</p>

          {project.liveUrl && (
            <Button href={project.liveUrl} variant='secondary' className='mb-12'>
              Visit live site
              <ExternalLink className='h-4 w-4' />
            </Button>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className='relative aspect-video overflow-hidden rounded-2xl border border-border mb-12'>
            <Image
              src={project.thumb}
              alt={project.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </Reveal>

        {project.kpis.length > 0 && (
          <Reveal delay={0.15}>
            <div className='grid grid-cols-3 gap-6 mb-12 py-8 border-y border-border'>
              {project.kpis.map(kpi => (
                <div key={kpi.label}>
                  <p className='text-2xl font-bold text-cream'>{kpi.value}</p>
                  <p className='text-sm text-cream-muted'>{kpi.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <div className='grid gap-10 md:grid-cols-2 mb-12'>
            <div>
              <h2 className='text-lg font-semibold text-cream mb-3'>Problem</h2>
              <p className='text-cream-muted leading-relaxed'>{project.challenge}</p>
            </div>
            <div>
              <h2 className='text-lg font-semibold text-cream mb-3'>What I built</h2>
              <ul className='space-y-2'>
                {project.approach.map((step, i) => (
                  <li key={i} className='flex gap-2 text-cream-muted text-sm'>
                    <span className='text-cream'>→</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <h2 className='text-lg font-semibold text-cream mb-4'>Stack</h2>
          <div className='flex flex-wrap gap-2'>
            {project.stack.map(tech => (
              <span
                key={tech}
                className='rounded-full border border-border bg-surface px-3 py-1 text-sm text-cream-muted'
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
