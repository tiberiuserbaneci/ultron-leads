/* ─── Cheatsheet registry ─── */

export interface CheatsheetMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  iconPath: string;
}

export const cheatsheets: CheatsheetMeta[] = [
  {
    slug: "code-vs-cowork-vs-projects",
    title: "Code vs Cowork vs Projects",
    subtitle: "Same AI. Three different ways to use it.",
    description: "A side-by-side breakdown of Claude Code, Cowork, and Projects. What each does, when to use it, and how context works across all three.",
    badge: "Comparison",
    iconPath: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  },
];

export function getCheatsheetBySlug(slug: string): CheatsheetMeta | undefined {
  return cheatsheets.find((c) => c.slug === slug);
}
