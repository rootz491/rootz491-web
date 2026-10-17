export type ToolFilterItem = {
  name: string;
  description: string;
  category: string;
  url?: string;
  slug?: string;
};

export type ToolSort = 'default' | 'name';

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

export function normalizeSearch(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function compact(s: string): string {
  return normalizeSearch(s).replace(/ /g, '');
}

export function filterTools<T extends ToolFilterItem>(
  items: T[],
  category: string,
  query: string
): T[] {
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  const matchAllCategories = category === ALL;

  return items.filter(tool => {
    if (!matchAllCategories && tool.category !== category) return false;
    if (tokens.length === 0) return true;

    const parts = [tool.name, tool.description, tool.category];
    if (tool.slug) parts.push(tool.slug);
    if (tool.url) parts.push(toolHost(tool.url) + toolPath(tool.url));

    const haystack = normalizeSearch(parts.join(' '));
    const packed = compact(haystack);

    return tokens.every(
      token => haystack.includes(token) || packed.includes(token)
    );
  });
}

export function sortTools<T extends { name: string }>(
  items: T[],
  sort: ToolSort
): T[] {
  const copy = items.slice();
  if (sort === 'name') {
    copy.sort((a, b) =>
      a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base',
        numeric: true,
      })
    );
  }
  return copy;
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
