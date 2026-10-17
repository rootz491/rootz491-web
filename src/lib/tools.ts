export type ToolFilterItem = {
  name: string;
  description: string;
  category: string;
};

const ALL = 'All';

export function toolHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function toolPath(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/+$/, '');
  } catch {
    return '';
  }
}

export function filterTools<T extends ToolFilterItem>(
  items: T[],
  category: string,
  query: string
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter(tool => {
    const matchesCategory = category === ALL || tool.category === category;
    const matchesQuery =
      normalizedQuery === '' ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

export function groupByCategory<T extends ToolFilterItem>(
  items: T[],
  order: readonly string[]
): { category: string; items: T[] }[] {
  return order
    .map(category => ({
      category,
      items: items.filter(item => item.category === category),
    }))
    .filter(group => group.items.length > 0);
}
