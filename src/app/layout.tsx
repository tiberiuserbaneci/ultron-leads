import type { Metadata } from "next";
import "./globals.css";
import RootShell from "@/components/RootShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://work.51ultron.com"),
  title: {
    default: "Ultron - AI Agents for Founders",
    template: "%s | Ultron",
  },
  description: "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring - running 24/7 for $19/month.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Ultron",
    locale: "en_US",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@51ultron",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3J0DEZGD69"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3J0DEZGD69');
            `,
          }}
        />

        {/* Detect Nexity host before first paint to prevent Ultron flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var h = window.location.hostname;
                if (h === 'nexitynetwork.org' || h === 'www.nexitynetwork.org') {
                  document.documentElement.classList.add('nexity-host');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-black text-white min-h-screen">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
