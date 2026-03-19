import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
        <Nav />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
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
      </body>
    </html>
  );
}
