import { ToolsExplorer } from '@/components/sections/ToolsExplorer';
import { getTools } from '@/lib/content';
import { generateMetadata, getToolsSchema } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Tools',
  description: getTools().subtitle,
  path: '/tools',
});

export default function ToolsPage() {
  const toolsSchema = getToolsSchema();

  return (
    <div className='pt-8'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }}
      />
      <ToolsExplorer />
    </div>
  );
}
