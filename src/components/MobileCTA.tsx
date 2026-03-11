"use client";

import { usePathname } from "next/navigation";

export default function MobileCTA() {
  const pathname = usePathname();

  // Homepage and demo page have their own CTAs
  if (pathname === "/" || pathname.startsWith("/demo") || pathname.startsWith("/live") || pathname.startsWith("/brain")) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-black border-t border-[#1a1a1a]">
      <a
        href="https://app.51ultron.com/signup"
        className="block w-full text-center btn-gradient glow-accent text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-200"
      >
        Try Ultron Free
      </a>
    </div>
  );
}
