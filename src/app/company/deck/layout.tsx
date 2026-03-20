import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Deck — NXT Enterprises",
  description: "NXT Enterprises investment deck and company overview.",
};

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide parent footer and override parent bg on deck page */
        body footer, body > div > footer, [class*="NexityFooter"] { display: none !important; }
        body > div > div.bg-\\[\\#faf8f5\\] { background: #0a0a0a !important; }
        /* Prevent horizontal scrollbar (orange line on hover) */
        html, body { overflow-x: hidden !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      {children}
    </>
  );
}
