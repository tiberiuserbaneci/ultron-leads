"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/data/news";

/* ── helpers ────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function BlogArticle({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
      {/* ── Back + meta ────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/company/news"
          className="text-sm text-[#999] hover:text-[#555] transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="flex items-center gap-3 text-xs text-[#aaa]">
          <span className="uppercase tracking-wider font-medium text-[#999]">
            {post.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#ddd]" />
          <span>{formatDate(post.date)}</span>
        </div>
      </div>

      {/* ── Title ──────────────────────────────────────────── */}
      <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#1a1a1a] leading-tight mb-3">
        {post.title}
      </h1>
      <p className="text-[#888] text-sm mb-10">{post.readTime}</p>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="h-px bg-[#eee] mb-10" />

      {/* ── Body (markdown) ────────────────────────────────── */}
      <div className="prose-article">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body}
        </ReactMarkdown>
      </div>

      {/* ── Divider before related ────────────────────────── */}
      <div className="mt-14 border-t border-[#eee]" />

      {/* ── Related posts ──────────────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-8">
            Related
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/company/news/${r.slug}`}
                className="group block border border-[#e8e8e8] rounded-xl p-5 transition-colors hover:border-[#ccc]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-medium text-[#999]">
                    {r.category}
                  </span>
                  <span className="text-xs text-[#bbb]">
                    {formatDate(r.date)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#555] transition-colors leading-snug">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
