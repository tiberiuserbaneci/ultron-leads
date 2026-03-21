import type { MetadataRoute } from "next";
import { posts } from "@/data/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://work.51ultron.com";
  const now = new Date().toISOString();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: string }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/blueprint", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.9, changeFrequency: "monthly" },
    { path: "/demo", priority: 0.9, changeFrequency: "monthly" },
    { path: "/72hours", priority: 0.8, changeFrequency: "monthly" },
    { path: "/calculator", priority: 0.8, changeFrequency: "monthly" },
    { path: "/stack", priority: 0.8, changeFrequency: "monthly" },
    { path: "/competitor", priority: 0.8, changeFrequency: "monthly" },
    { path: "/levels", priority: 0.8, changeFrequency: "monthly" },
    { path: "/assess", priority: 0.8, changeFrequency: "monthly" },
    { path: "/live", priority: 0.7, changeFrequency: "monthly" },
    { path: "/brain", priority: 0.7, changeFrequency: "monthly" },
    { path: "/agents-map", priority: 0.7, changeFrequency: "monthly" },
    { path: "/client-engine", priority: 0.7, changeFrequency: "monthly" },
    { path: "/library", priority: 0.7, changeFrequency: "monthly" },
    { path: "/claude-skills", priority: 0.6, changeFrequency: "monthly" },
    { path: "/client-kit", priority: 0.6, changeFrequency: "monthly" },
    { path: "/cheatsheets", priority: 0.6, changeFrequency: "monthly" },
    { path: "/rfp", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries = routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /* ── News listing page ─────────────────────────────────────── */
  const newsListEntry: MetadataRoute.Sitemap[number] = {
    url: `${base}/company/news`,
    lastModified: posts.length > 0 ? new Date(posts[0].date).toISOString() : now,
    changeFrequency: "weekly",
    priority: 0.8,
  };

  /* ── Individual blog posts ─────────────────────────────────── */
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/company/news/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, newsListEntry, ...blogEntries];
}
