"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLiveStats } from "./HeroStats";
import { trackNavClicked, trackOutboundLinkClicked, trackCtaClicked } from "@/lib/analytics";

/* ───────────────────────── External Link Icon ───────────────────────── */
function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-40 shrink-0"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ───────────────────────── Chevron Icon ───────────────────────── */
function ChevronDown({ open, className = "" }: { open: boolean; className?: string }) {
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
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ───────────────────────── Plus/Minus Icon (mobile) ───────────────────────── */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#555] shrink-0"
    >
      <line x1="12" y1="5" x2="12" y2="19" className={`transition-transform duration-200 origin-center ${open ? "scale-y-0" : ""}`} />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ───────────────────────── Nav Item Types ───────────────────────── */
type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type NavGroup = {
  heading?: string;
  items: NavLink[];
};

type NavDropdown = {
  label: string;
  groups: NavGroup[];
};

/* ───────────────────────── Menu Data ───────────────────────── */
const NAV_MENUS: NavDropdown[] = [
  {
    label: "Meet Ultron",
    groups: [
      {
        items: [
          { label: "Interactive Demo", href: "/demo" },
          { label: "Agents Map", href: "/agents-map" },
          { label: "Dashboard", href: "/live" },
          { label: "Engine", href: "/client-engine" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    groups: [
      {
        heading: "Architecture",
        items: [
          { label: "The Blueprint", href: "/blueprint" },
          { label: "Tech Stack", href: "/stack" },
        ],
      },
      {
        heading: "Proof",
        items: [
          { label: "Real Logs", href: "/72hours" },
          { label: "ROI Calculator", href: "/calculator" },
          { label: "Reality Check", href: "/competitor" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    groups: [
      {
        items: [
          { label: "Overview", href: "/pricing" },
          { label: "FAQ", href: "/faq" },
          { label: "Automation Quiz", href: "/assess" },
          { label: "Contact Sales", href: "/contact" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        heading: "Learn",
        items: [
          { label: "Playbooks", href: "https://catalinfetean.substack.com/", external: true },
          { label: "Documentation", href: "https://docs.51ultron.com/get-started/introduction", external: true },
        ],
      },
      {
        heading: "Tools",
        items: [
          { label: "Library", href: "/library" },
          { label: "Templates", href: "https://dealmaker.nexitynetwork.org/", external: true },
        ],
      },
    ],
  },
];

/* ───────────────────────── Desktop Dropdown Panel ───────────────────────── */
function DropdownPanel({
  menu,
  open,
  onClose,
}: {
  menu: NavDropdown;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const cols = menu.groups.length;
  const hasHeadings = menu.groups.some((g) => g.heading);

  return (
    <div className="absolute top-full left-0 pt-2" onMouseLeave={onClose}>
      <div className="bg-[#0c0c0c] border border-[#222] rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-dropdown-in">
        <div
          className="flex divide-x divide-[#1a1a1a]"
          style={cols > 1 ? {} : {}}
        >
          {menu.groups.map((group, gi) => (
            <div key={gi} className="py-3 px-1" style={{ minWidth: "200px" }}>
              {group.heading && (
                <p className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#555] px-4 pb-3">
                  {group.heading}
                </p>
              )}
              {group.items.map((item) => {
                const isExternal = item.external;
                const Comp = isExternal ? "a" : Link;
                const extraProps = isExternal
                  ? { target: "_blank" as const, rel: "noopener noreferrer" }
                  : {};

                return (
                  <Comp
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (isExternal) {
                        trackOutboundLinkClicked(item.href, item.label, `nav_${menu.label}`);
                      } else {
                        trackNavClicked(item.label, item.href, menu.label);
                      }
                      onClose();
                    }}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] text-[#ccc] hover:text-white hover:bg-[#161616] rounded-lg mx-1 transition-colors duration-100"
                    {...extraProps}
                  >
                    {item.label}
                    {isExternal && <ExternalIcon />}
                  </Comp>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Mobile Accordion ───────────────────────── */
function MobileAccordion({
  menu,
  onClose,
}: {
  menu: NavDropdown;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-[#1a1a1a]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-6 py-5 text-[16px] text-[#999] hover:text-white transition-colors"
      >
        {menu.label}
        <PlusIcon open={expanded} />
      </button>

      {expanded && (
        <div className="pb-5 px-6">
          {menu.groups.map((group, gi) => (
            <div key={gi} className="mb-2 last:mb-0">
              {group.heading && (
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#444] mb-2 mt-1">
                  {group.heading}
                </p>
              )}
              {group.items.map((item) => {
                const isExternal = item.external;
                const Comp = isExternal ? "a" : Link;
                const extraProps = isExternal
                  ? { target: "_blank" as const, rel: "noopener noreferrer" }
                  : {};

                return (
                  <Comp
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (isExternal) {
                        trackOutboundLinkClicked(item.href, item.label, `nav_mobile_${menu.label}`);
                      } else {
                        trackNavClicked(item.label, item.href, `mobile_${menu.label}`);
                      }
                      onClose();
                    }}
                    className="flex items-center justify-between py-2.5 text-[15px] text-[#ccc] hover:text-white transition-colors"
                    {...extraProps}
                  >
                    {item.label}
                    {isExternal && <ExternalIcon />}
                  </Comp>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                          NAV                                    */
/* ═══════════════════════════════════════════════════════════════ */

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const mobileStatsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const live = useLiveStats();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (statsOpen) {
        const inDesktop = statsRef.current?.contains(e.target as Node);
        const inMobile = mobileStatsRef.current?.contains(e.target as Node);
        if (!inDesktop && !inMobile) setStatsOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [statsOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleMouseEnter(label: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[60]">
      {/* Top bar */}
      <div className={`backdrop-blur-md ${mobileMenuOpen ? "bg-black" : "bg-black/90"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/logo.png" alt="Ultron" width={36} height={36} className="rounded-sm" />
              <span className="font-bold text-white text-xl tracking-tight">Ultron</span>
            </Link>

            {/* Center links — desktop */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_MENUS.map((menu) => (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(menu.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1.5 text-[15px] px-3.5 py-2 rounded-lg transition-colors duration-150 ${
                      openDropdown === menu.label
                        ? "text-white"
                        : "text-[#999] hover:text-white"
                    }`}
                    onClick={() =>
                      setOpenDropdown(openDropdown === menu.label ? null : menu.label)
                    }
                  >
                    {menu.label}
                    <ChevronDown open={openDropdown === menu.label} />
                  </button>

                  <DropdownPanel
                    menu={menu}
                    open={openDropdown === menu.label}
                    onClose={() => setOpenDropdown(null)}
                  />
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Live stats button — desktop only */}
              <div className="hidden md:block relative" ref={statsRef}>
                <button
                  onClick={() => setStatsOpen(!statsOpen)}
                  className={`flex items-center gap-2.5 text-[13px] px-3.5 py-2 rounded-lg transition-colors ${
                    statsOpen ? "text-white bg-[#1a1a1a]" : "text-[#777] hover:text-white"
                  }`}
                >
                  {/* Branch icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <line x1="6" y1="3" x2="6" y2="15" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                  </svg>
                  <span className="tabular-nums font-medium text-white">{live.founders.toLocaleString()}</span>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" className={`text-[#555] transition-transform ${statsOpen ? "rotate-180" : ""}`}>
                    <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Stats dropdown */}
                {statsOpen && (
                  <div className="absolute right-0 top-full mt-3 bg-[#111] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] animate-fade-up z-50 select-none">
                    <div className="flex items-center gap-6 px-6 py-4">
                      {[
                        { val: live.founders.toLocaleString(), lbl: "Founders" },
                        { val: live.agents >= 1000 ? `${(live.agents / 1000).toFixed(1)}K` : live.agents.toLocaleString(), lbl: "Agents" },
                        { val: live.tasks >= 1000 ? `${(live.tasks / 1000).toFixed(1)}K` : live.tasks.toLocaleString(), lbl: "Tasks" },
                        { val: live.apiCalls >= 1000 ? `${(live.apiCalls / 1000).toFixed(1)}K` : live.apiCalls.toString(), lbl: "API calls" },
                        { val: `$${live.saved >= 1000 ? `${Math.round(live.saved / 1000)}K` : live.saved}`, lbl: "Saved" },
                      ].map((s) => (
                        <div key={s.lbl} className="flex flex-col items-center gap-0.5">
                          <span className="text-white font-semibold text-[16px] tabular-nums">{s.val}</span>
                          <span className="text-[#555] text-[11px]">{s.lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Try Ultron — desktop only */}
              <Link
                href="https://app.51ultron.com/signup"
                onClick={() => trackCtaClicked("Try Ultron", "nav_desktop", "https://app.51ultron.com/signup")}
                className="hidden md:inline-flex text-[15px] font-semibold text-white border border-[#DA4E24] rounded-full px-6 py-2 hover:bg-[#DA4E24]/10 transition-colors"
              >
                Try Ultron
              </Link>

              {/* Founder badge + Burger — mobile only */}
              <div className="md:hidden flex items-center gap-2">
                <div className="relative" ref={mobileStatsRef}>
                  <button
                    onClick={() => { setStatsOpen(!statsOpen); if (mobileMenuOpen) setMobileMenuOpen(false); }}
                    className={`flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-lg transition-colors ${
                      statsOpen ? "text-white bg-[#1a1a1a]" : "text-[#777] hover:text-white"
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <line x1="6" y1="3" x2="6" y2="15" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9a9 9 0 0 1-9 9" />
                    </svg>
                    <span className="tabular-nums font-medium text-white">{live.founders.toLocaleString()}</span>
                    <svg width="7" height="7" viewBox="0 0 12 12" fill="none" className={`text-[#555] transition-transform ${statsOpen ? "rotate-180" : ""}`}>
                      <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Mobile stats dropdown */}
                  {statsOpen && (
                    <div className="absolute right-0 top-full mt-3 bg-[#111] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] animate-fade-up z-50 select-none">
                      <div className="flex items-center gap-5 px-5 py-4">
                        {[
                          { val: live.founders.toLocaleString(), lbl: "Founders" },
                          { val: live.agents >= 1000 ? `${(live.agents / 1000).toFixed(1)}K` : live.agents.toLocaleString(), lbl: "Agents" },
                          { val: live.tasks >= 1000 ? `${(live.tasks / 1000).toFixed(1)}K` : live.tasks.toLocaleString(), lbl: "Tasks" },
                          { val: `$${live.saved >= 1000 ? `${Math.round(live.saved / 1000)}K` : live.saved}`, lbl: "Saved" },
                        ].map((s) => (
                          <div key={s.lbl} className="flex flex-col items-center gap-0.5">
                            <span className="text-white font-semibold text-[14px] tabular-nums">{s.val}</span>
                            <span className="text-[#555] text-[10px]">{s.lbl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-9 h-9 flex items-center justify-center text-[#999] hover:text-white transition-colors"
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
      </div>

      {/* Mobile full-screen overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-black z-50 flex flex-col">
          {/* Scrollable menu area */}
          <div className="flex-1 overflow-y-auto pt-4">
            {NAV_MENUS.map((menu) => (
              <MobileAccordion
                key={menu.label}
                menu={menu}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>

          {/* Sticky bottom CTA buttons */}
          <div className="shrink-0 px-6 py-6 border-t border-[#1a1a1a] flex gap-3">
            <Link
              href="/contact"
              onClick={() => { trackCtaClicked("Contact Sales", "nav_mobile", "/contact"); setMobileMenuOpen(false); }}
              className="flex-1 text-center text-sm font-semibold text-white border border-[#333] rounded-full py-3 hover:border-[#555] transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              href="https://app.51ultron.com/signup"
              onClick={() => { trackCtaClicked("Try Ultron", "nav_mobile", "https://app.51ultron.com/signup"); setMobileMenuOpen(false); }}
              className="flex-1 text-center text-sm font-semibold text-black bg-white rounded-full py-3 hover:bg-[#e0e0e0] transition-colors"
            >
              Try Ultron
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
