#!/usr/bin/env node
/**
 * Generates an RSS 2.0 feed (public/feed.xml) from the blog posts in /content/news/.
 * Run after generate-news.js or independently — reads the same markdown source.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://work.51ultron.com';
const newsDir = path.join(__dirname, '..', 'content', 'news');
const outFile = path.join(__dirname, '..', 'public', 'feed.xml');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    if (line.startsWith('  -') || line.startsWith('    -')) continue;
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      let value = kvMatch[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[kvMatch[1]] = value;
    }
  }
  return frontmatter;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Also include the hardcoded hero post
const hardcodedPosts = [
  {
    slug: 'ai-sales-agents-replacing-sdrs-2026',
    title: 'Why AI Sales Agents Are Replacing SDRs in 2026',
    excerpt: "The economics of outbound sales have fundamentally shifted. Here's how autonomous AI agents are outperforming human SDR teams at a fraction of the cost.",
    category: 'AI Automation',
    date: '2026-03-18',
  },
];

const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(newsDir, file), 'utf-8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;
  posts.push({
    slug: fm.slug || file.replace('.md', ''),
    title: fm.title || '',
    excerpt: fm.excerpt || '',
    category: fm.category || 'General',
    date: fm.date || '2026-03-20',
  });
}

// Merge hardcoded posts (avoid duplicates)
const slugSet = new Set(posts.map(p => p.slug));
for (const hp of hardcodedPosts) {
  if (!slugSet.has(hp.slug)) posts.push(hp);
}

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

const buildDate = new Date().toUTCString();

const items = posts.map(p => {
  const pubDate = new Date(p.date).toUTCString();
  const link = `${BASE_URL}/company/news/${p.slug}/`;
  return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ultron — News &amp; Insights</title>
    <link>${BASE_URL}/company/news/</link>
    <description>Latest news, insights, and product updates from NXT Enterprises and Ultron — AI agents for business.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>Ultron</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(outFile, rss, 'utf-8');
console.log(`Generated RSS feed with ${posts.length} posts → public/feed.xml`);
