import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "@/data/news";
import BlogArticle from "./BlogArticle";

/* ── Static params for export ──────────────────────────────── */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/* ── Dynamic SEO metadata ──────────────────────────────────── */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — NXT Enterprises`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      siteName: "NXT Enterprises",
      locale: "en_US",
      publishedTime: post.date,
    },
  };
}

/* ── Page ───────────────────────────────────────────────────── */
export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = posts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return <BlogArticle post={post} related={related} />;
}
