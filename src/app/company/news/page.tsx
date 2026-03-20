"use client";

import Link from "next/link";
import { posts } from "@/data/news";

/* ── helpers ────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const featured = posts.find((p) => p.featured) ?? posts[0];
const rest = posts.filter((p) => p.slug !== featured.slug);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function NewsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
      {/* ── Header ─────────────────────────────────────────── */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
        News
      </h1>
      <p className="text-[#888] text-base sm:text-lg mb-12 sm:mb-16">
        Updates from NXT Enterprises and Ultron.
      </p>

      {/* ── Featured post ──────────────────────────────────── */}
      <Link
        href={`/company/news/${featured.slug}`}
        className="group block mb-16 sm:mb-20"
      >
        <div className="border border-[#e8e8e8] rounded-2xl p-6 sm:p-10 transition-colors hover:border-[#ccc]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#999]">
              Featured
            </span>
            <span className="w-1 h-1 rounded-full bg-[#ddd]" />
            <span className="text-xs text-[#999]">{featured.category}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#555] transition-colors">
            {featured.title}
          </h2>
          <p className="text-[#777] text-base sm:text-lg leading-relaxed mb-5 max-w-2xl">
            {featured.excerpt}
          </p>
          <div className="flex items-center gap-3 text-sm text-[#aaa]">
            <span>{formatDate(featured.date)}</span>
            <span className="w-1 h-1 rounded-full bg-[#ddd]" />
            <span>{featured.readTime}</span>
          </div>
        </div>
      </Link>

      {/* ── All posts grid ─────────────────────────────────── */}
      <h2 className="text-xl font-semibold text-[#1a1a1a] mb-8">
        All posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/company/news/${post.slug}`}
            className="group block border border-[#e8e8e8] rounded-xl p-5 sm:p-6 transition-colors hover:border-[#ccc]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-[#999]">
                {post.category}
              </span>
              <span className="text-xs text-[#bbb]">
                {formatDate(post.date)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#555] transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-[#888] leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
            <div className="mt-4 text-xs text-[#bbb]">{post.readTime}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
