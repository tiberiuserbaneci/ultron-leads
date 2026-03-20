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
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://nexitynetwork.org/company/news/${post.slug}`;

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

      {/* ── Share bar ──────────────────────────────────────── */}
      <div className="mt-14 pt-6 border-t border-[#eee] flex items-center justify-between">
        <span className="text-sm text-[#999]">Share</span>
        <div className="flex items-center gap-4">
          <a
            href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#bbb] hover:text-[#1a1a1a] transition-colors"
            aria-label="Share on X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#bbb] hover:text-[#1a1a1a] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="text-[#bbb] hover:text-[#1a1a1a] transition-colors"
            aria-label="Copy link"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 9.88" />
            </svg>
          </button>
        </div>
      </div>

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
