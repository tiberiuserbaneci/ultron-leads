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
      `}</style>
      {children}
    </>
  );
}
