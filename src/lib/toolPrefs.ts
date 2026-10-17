import type { ToolSort } from './tools';

export const VIEW_KEY = 'rz-tools:view';
export const SORT_KEY = 'rz-tools:sort';
export const FAVORITES_KEY = 'rz-tools:favorites';

export type ToolView = 'grid' | 'list';

export function parseView(raw: string | null): ToolView {
  return raw === 'list' ? 'list' : 'grid';
}

export function parseSort(raw: string | null): ToolSort {
  return raw === 'name' ? 'name' : 'default';
}

export function parseFavorites(
  raw: string | null,
  validSlugs?: readonly string[]
): string[] {
  if (raw == null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const seen = new Set<string>();
  const favorites: string[] = [];
  for (const value of parsed) {
    if (typeof value !== 'string' || seen.has(value)) continue;
    seen.add(value);
    favorites.push(value);
  }

  if (validSlugs) {
    const valid = new Set(validSlugs);
    return favorites.filter(slug => valid.has(slug));
  }

  return favorites;
}

export function readPref(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures (disabled storage, private mode, quota).
  }
}

export function toggleFavorite(list: string[], slug: string): string[] {
  return list.includes(slug)
    ? list.filter(item => item !== slug)
    : [...list, slug];
}
