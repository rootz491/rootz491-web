import { Card, CardContent } from '@/components/ui/card';
import { getPageContent } from '@/lib/content';
import { generateMetadata } from '@/lib/seo';
import { CheckCircle, User } from 'lucide-react';

export const metadata = generateMetadata({
  title: 'About Us',
  path: '/about',
});

export default function AboutPage() {
  const page = getPageContent('/about');
  const { title, lede, highlights, team, badges } = page;

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <section className='bg-muted/40 py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6'>
              {title}
            </h1>
            <p className='text-xl text-muted-foreground leading-relaxed'>
              {lede}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-bold mb-8'>Highlights</h2>
            <ul className='space-y-4'>
              {highlights.map((highlight, idx) => (
                <li key={idx} className='flex items-start gap-3'>
                  <CheckCircle className='h-6 w-6 text-primary shrink-0 mt-0.5' />
                  <span className='text-lg'>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className='py-20 bg-muted/40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold mb-12 text-center'>Team</h2>
            <div className='grid gap-8 md:grid-cols-2'>
              {team.map((member, idx) => (
                <Card key={idx}>
                  <CardContent className='pt-6'>
                    <div className='flex items-start gap-4'>
                      <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                        <User className='h-8 w-8 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-bold text-lg'>{member.name}</h3>
                        <p className='text-sm text-muted-foreground mb-2'>
                          {member.role}
                        </p>
                        <p className='text-sm'>{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications/Badges */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold mb-8 text-center'>
              Registrations
            </h2>
            <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-4'>
              {badges.map((badge, idx) => (
                <Card key={idx} className='text-center'>
                  <CardContent className='pt-6'>
                    <div className='font-semibold mb-2'>{badge.label}</div>
                    {badge.value && (
                      <div className='text-xs text-muted-foreground'>
                        {badge.value}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
