"use client";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  return <main className="pt-16">{children}</main>;
}
