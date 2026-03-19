import { templates, getTemplateBySlug } from "../templateData";
import DocumentShell from "../DocumentShell";
import { notFound } from "next/navigation";

/* ─── Static params for SSG ─── */
export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

/* ─── Metadata ─── */
export function generateMetadata({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
  if (!template) return { title: "Not Found" };
  return {
    title: `${template.name} - Client Kit`,
    description: template.shortDescription,
  };
}

/* ─── Page ─── */
export default function TemplatePage({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
  if (!template) notFound();
  return <DocumentShell template={template} />;
}
