// Hrefs that must not go through next/link: external URLs, mail links and
// files such as the resume PDF (next/link would prefetch them as RSC payloads).
export function isPlainAnchor(href: string): boolean {
  const lower = href.trim().toLowerCase();
  const path = lower.split(/[?#]/, 1)[0];
  return (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('//') ||
    lower.startsWith('mailto:') ||
    path.endsWith('.pdf')
  );
}

export function isPdfHref(href: string): boolean {
  return href.trim().toLowerCase().split(/[?#]/, 1)[0].endsWith('.pdf');
}
