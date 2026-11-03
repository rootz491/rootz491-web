export type SectionHeadingLevel = 'h1' | 'h2';
export type CardHeadingLevel = 'h2' | 'h3';

/** Card headings stay exactly one level below the section heading. */
export function cardHeadingFor(headingAs: SectionHeadingLevel): CardHeadingLevel {
  return headingAs === 'h1' ? 'h2' : 'h3';
}
