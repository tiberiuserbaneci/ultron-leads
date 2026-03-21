import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "@/data/news";
import BlogArticle from "./BlogArticle";

const BASE_URL = "https://work.51ultron.com";

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

  const postUrl = `${BASE_URL}/company/news/${post.slug}`;

  return {
    title: `${post.title} — NXT Enterprises`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "NXT Enterprises",
      locale: "en_US",
      publishedTime: post.date,
      images: [
        {
          url: `${BASE_URL}/og/home.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@51ultron",
      title: post.title,
      description: post.excerpt,
      images: [`${BASE_URL}/og/home.png`],
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

  const postUrl = `${BASE_URL}/company/news/${post.slug}`;

  /* ── JSON-LD: BlogPosting ──────────────────────────────────── */
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    author: {
      "@type": "Organization",
      name: "NXT Enterprises",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Ultron",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    image: `${BASE_URL}/og/home.png`,
    articleSection: post.category,
  };

  /* ── JSON-LD: BreadcrumbList ───────────────────────────────── */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: `${BASE_URL}/company/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogArticle post={post} related={related} />
    </>
  );
}
