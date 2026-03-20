"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvestorsDeckRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/company/deck/?tab=deck");
  }, [router]);
  return null;
}
