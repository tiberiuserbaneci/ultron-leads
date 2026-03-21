import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PostHogProvider from "@/components/PostHogProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://work.51ultron.com"),
  title: {
    default: "Ultron — AI Agents for Founders | Agentic AI for Business",
    template: "%s | Ultron",
  },
  description:
    "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring — running 24/7 for $19/month. The agentic AI platform built for founders.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Ultron",
    locale: "en_US",
    title: "Ultron — AI Agents for Founders",
    description:
      "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring — running 24/7 for $19/month.",
    url: "https://work.51ultron.com",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Ultron — AI Agents for Founders" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@51ultron",
    title: "Ultron — AI Agents for Founders",
    description:
      "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring — running 24/7 for $19/month.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
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
      </head>
      <body className="bg-black text-white min-h-screen">
        <PostHogProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ultron",
              url: "https://work.51ultron.com",
              logo: "https://work.51ultron.com/logo.png",
              description:
                "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring — running 24/7 for $19/month.",
              sameAs: ["https://x.com/51ultron"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "sales",
                url: "https://work.51ultron.com/contact",
              },
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "0",
                highPrice: "297",
                priceCurrency: "USD",
                offerCount: "3",
              },
            }),
          }}
        />
        <Nav />
        <main className="pt-16">
          {children}
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.intercomSettings = {
                api_base: "https://api-iam.intercom.io",
                app_id: "k6faqs6h",
                hide_default_launcher: true
              };
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/k6faqs6h';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onDOMContentLoaded',l);w.attachEvent('onload',l);}else{w.addEventListener('DOMContentLoaded',l,false);w.addEventListener('load',l,false);}}})();
            `,
          }}
        />
        </PostHogProvider>
      </body>
    </html>
  );
}
