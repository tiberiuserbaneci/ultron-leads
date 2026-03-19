import { cheatsheets, getCheatsheetBySlug } from "../cheatsheetData";
import CodeVsCoworkVsProjects from "../CodeVsCoworkVsProjects";
import { notFound } from "next/navigation";

/* ─── Map of slug to component ─── */
const cheatsheetComponents: Record<string, React.ComponentType> = {
  "code-vs-cowork-vs-projects": CodeVsCoworkVsProjects,
};

/* ─── Static params for SSG ─── */
export function generateStaticParams() {
  return cheatsheets.map((c) => ({ slug: c.slug }));
}

/* ─── Metadata ─── */
export function generateMetadata({ params }: { params: { slug: string } }) {
  const cs = getCheatsheetBySlug(params.slug);
  if (!cs) return { title: "Not Found" };
  return {
    title: `${cs.title} - Claude Cheatsheets`,
    description: cs.description,
  };
}

/* ─── Page ─── */
export default function CheatsheetPage({ params }: { params: { slug: string } }) {
  const cs = getCheatsheetBySlug(params.slug);
  if (!cs) notFound();

  const Component = cheatsheetComponents[params.slug];
  if (!Component) notFound();

  return <Component />;
}
