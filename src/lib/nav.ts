export function isPlainAnchor(href: string): boolean {
  const path = href.split(/[?#]/, 1)[0];
  return (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    path.endsWith('.pdf')
  );
}
