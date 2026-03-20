"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvestorsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/company/deck/?tab=summary");
  }, [router]);
  return null;
}
