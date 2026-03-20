import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Deck — NXT Enterprises",
  description: "NXT Enterprises investment deck and company overview.",
};

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide parent light footer — we render our own dark one */
        body footer, body > div > footer, [class*="NexityFooter"],
        body > div > div > footer, footer.border-t.bg-white { display: none !important; }
        /* Force dark bg everywhere — nuke #faf8f5 from every ancestor */
        html { background: #0a0a0a !important; }
        body { background: #0a0a0a !important; }
        #__next, body > div { background: #0a0a0a !important; }
        body > div > div { background: #0a0a0a !important; }
        body > div > div > main { background: #0a0a0a !important; }
        body > div > div > main > * { background: #0a0a0a !important; }
        .bg-\\[\\#faf8f5\\] { background: #0a0a0a !important; }
        /* Prevent horizontal scrollbar */
        html, body { overflow-x: hidden !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loadingDot { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
      `}</style>
      {children}
    </>
  );
}
