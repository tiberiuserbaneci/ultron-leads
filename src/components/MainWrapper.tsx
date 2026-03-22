"use client";

import { usePathname } from "next/navigation";

const DECK_PATHS = ["/company/deck", "/investors/deck"];

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDeck = DECK_PATHS.includes(pathname);

  return (
    <main className={isDeck ? "sm:pt-0 pt-16" : "pt-16"}>
      {children}
    </main>
  );
}
