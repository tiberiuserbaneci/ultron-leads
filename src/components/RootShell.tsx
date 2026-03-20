"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNexity = pathname.startsWith("/nexity");

  if (isNexity) {
    return <>{children}</>;
  }

  return (
    <>
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
      <main className="pt-16">{children}</main>
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
    </>
  );
}
