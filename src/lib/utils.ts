import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Mask sensitive information (certificate numbers, etc.)
 */
export function maskSensitiveData(data: string, showLast: number = 4): string {
  if (data.length <= showLast) return data;
  const masked = 'X'.repeat(data.length - showLast);
  return masked + data.slice(-showLast);
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Check if string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is a valid phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, hyphens, and +91
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Check for 10 digits (with optional 91 prefix)
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
}

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parsePeriodEnd(token: string): Date {
  if (token === 'Present') return new Date();
  const [mon, year] = token.split(' ');
  return new Date(parseInt(year), MONTH_MAP[mon], 1);
}

/**
 * Calculate a human-readable duration from a period string like
 * "Aug 2023 — Present" or "May 2023 — Aug 2023".
 * Returns a string such as "1 yr 7 mos", "4 mos", "1 yr", etc.
 */
export function calcDuration(period: string): string {
  const [startToken, endToken] = period.split('—').map(s => s.trim());
  const [startMon, startYear] = startToken.split(' ');
  const start = new Date(parseInt(startYear), MONTH_MAP[startMon], 1);
  const end = parsePeriodEnd(endToken);

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ');
}
