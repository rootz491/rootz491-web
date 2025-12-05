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
