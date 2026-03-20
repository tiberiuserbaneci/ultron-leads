"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ───────────────────────── Chevron Icon ───────────────────────── */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ───────────────────────── Arrow Icon ───────────────────────── */
function ArrowUpRight({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ───────────────────────── Try Ultron Dropdown ───────────────────────── */
const TRY_ULTRON_GROUPS = [
  {
    heading: "Products",
    items: [
      { label: "Ultron Dashboard", href: "https://app.51ultron.com", external: true },
      { label: "Interactive Demo", href: "https://51ultron.com/demo", external: true },
      { label: "Agents Map", href: "https://51ultron.com/agents-map", external: true },
    ],
  },
  {
    heading: "Get Started",
    items: [
      { label: "Sign Up", href: "https://app.51ultron.com/signup", external: true },
      { label: "Documentation", href: "https://docs.51ultron.com", external: true },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
];

/* ───────────────────────── Nav Links ───────────────────────── */
const NAV_LINKS = [
  { label: "News", href: "#news" },
  { label: "Investment Deck", href: "/nexity/deck" },
  { label: "Investor Relations", href: "https://investors.nexitynetwork.org", external: true },
  { label: "Contact Sales", href: "/contact" },
];

/* ═══════════════════════════════════════════════════════════════ */
/*                      NEXITY NAV                                 */
/* ═══════════════════════════════════════════════════════════════ */

export default function NexityNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tryUltronOpen, setTryUltronOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTryUltronOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close mobile on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60]">
      <div className={`backdrop-blur-md border-b border-[#e5e5e5] ${mobileMenuOpen ? "bg-white" : "bg-white/90"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/nexity" className="flex items-center gap-2.5 shrink-0">
              <Image src="/nxt-enterprises.png" alt="NXT" width={32} height={32} />
              <span className="font-bold text-[#1a1a1a] text-lg tracking-tight">NXT Enterprises</span>
            </Link>

            {/* Center links — desktop */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isExternal = "external" in link && link.external;
                return isExternal ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-[#666] hover:text-[#1a1a1a] px-3.5 py-2 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[15px] text-[#666] hover:text-[#1a1a1a] px-3.5 py-2 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Try Ultron dropdown — desktop */}
              <div
                className="hidden md:block relative"
                ref={dropdownRef}
                onMouseEnter={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setTryUltronOpen(true);
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => setTryUltronOpen(false), 150);
                }}
              >
                <button
                  onClick={() => setTryUltronOpen(!tryUltronOpen)}
                  className="flex items-center gap-2 text-[15px] font-semibold text-white bg-[#1a1a1a] rounded-full px-6 py-2.5 hover:bg-[#333] transition-colors"
                >
                  Try Ultron
                  <ChevronDown open={tryUltronOpen} />
                </button>

                {tryUltronOpen && (
                  <div className="absolute right-0 top-full pt-2">
                    <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-lg shadow-black/10 overflow-hidden animate-dropdown-in">
                      <div className="flex divide-x divide-[#f0f0f0]">
                        {TRY_ULTRON_GROUPS.map((group, gi) => (
                          <div key={gi} className="py-3 px-1" style={{ minWidth: "200px" }}>
                            <p className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#999] px-4 pb-3">
                              {group.heading}
                            </p>
                            {group.items.map((item) => {
                              const isExt = "external" in item && item.external;
                              return isExt ? (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setTryUltronOpen(false)}
                                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] text-[#555] hover:text-[#1a1a1a] hover:bg-[#f8f8f8] rounded-lg mx-1 transition-colors"
                                >
                                  {item.label}
                                  <ArrowUpRight className="w-3 h-3 opacity-40" />
                                </a>
                              ) : (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setTryUltronOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-[#555] hover:text-[#1a1a1a] hover:bg-[#f8f8f8] rounded-lg mx-1 transition-colors"
                                >
                                  {item.label}
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hamburger — mobile */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto pt-4">
            {NAV_LINKS.map((link) => {
              const isExternal = "external" in link && link.external;
              return isExternal ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-5 text-[16px] text-[#555] hover:text-[#1a1a1a] border-b border-[#f0f0f0] transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="w-4 h-4 opacity-40" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-5 text-[16px] text-[#555] hover:text-[#1a1a1a] border-b border-[#f0f0f0] transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Try Ultron section in mobile */}
            <div className="px-6 pt-6">
              <p className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#999] mb-3">Products</p>
              {TRY_ULTRON_GROUPS[0].items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-[15px] text-[#555] hover:text-[#1a1a1a] transition-colors"
                >
                  {item.label}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </a>
              ))}
            </div>
          </div>

          {/* Sticky bottom CTA */}
          <div className="shrink-0 px-6 py-6 border-t border-[#f0f0f0] flex gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold text-[#1a1a1a] border border-[#ddd] rounded-full py-3 hover:border-[#999] transition-colors"
            >
              Contact Sales
            </Link>
            <a
              href="https://app.51ultron.com/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center text-sm font-semibold text-white bg-[#1a1a1a] rounded-full py-3 hover:bg-[#333] transition-colors"
            >
              Try Ultron
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
