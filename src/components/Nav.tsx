"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ───────────────────────── External Link Icon ───────────────────────── */
function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-1 opacity-40 group-hover/link:opacity-70 transition-opacity inline-block"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ───────────────────────── Chevron Icon ───────────────────────── */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
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

/* ───────────────────────── Nav Item Types ───────────────────────── */
type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  desc?: string;
};

type NavGroup = {
  label: string;
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
        label: "Explore",
        items: [
          { label: "Interactive Demo", href: "/demo", desc: "Watch agents execute tasks in real time" },
          { label: "Agents Map", href: "/agents-map", desc: "32 agents across 7 departments" },
          { label: "Dashboard", href: "/live", desc: "Real-time command center" },
          { label: "Engine", href: "/client-engine", desc: "6 prebuilt growth engines" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    groups: [
      {
        label: "Architecture",
        items: [
          { label: "The Blueprint", href: "/blueprint", desc: "5-agent architecture diagram" },
          { label: "Tech Stack", href: "/stack", desc: "The $10K/month revenue stack" },
        ],
      },
      {
        label: "Proof",
        items: [
          { label: "Real Logs", href: "/72hours", desc: "72 hours of autonomous output" },
          { label: "ROI Calculator", href: "/calculator", desc: "Calculate your manual cost" },
          { label: "Reality Check", href: "/competitor", desc: "Your competitor's AI stack in 2026" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    groups: [
      {
        label: "Plans",
        items: [
          { label: "Overview", href: "#pricing", desc: "See all plans" },
          { label: "Automation Quiz", href: "/assess", desc: "Find your automation level" },
          { label: "Contact Sales", href: "https://app.51ultron.com/signup", desc: "Talk to our team", external: true },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        label: "Learn",
        items: [
          { label: "Playbooks", href: "https://catalinfetean.substack.com/", desc: "Founder growth playbooks", external: true },
          { label: "Documentation", href: "https://docs.51ultron.com/get-started/introduction", desc: "Get started with Ultron", external: true },
        ],
      },
      {
        label: "Tools",
        items: [
          { label: "Library", href: "/library", desc: "Skills, cheatsheets, kits & more" },
          { label: "Templates", href: "https://dealmaker.nexitynetwork.org/", desc: "DealMaker templates", external: true },
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
  const panelRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const totalColumns = menu.groups.length;

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
      onMouseLeave={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-dropdown-in"
        style={{ minWidth: totalColumns > 1 ? `${totalColumns * 200}px` : "240px" }}
      >
        <div className={`grid ${totalColumns > 1 ? `grid-cols-${totalColumns}` : "grid-cols-1"} divide-x divide-[#1a1a1a]`}
             style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}>
          {menu.groups.map((group) => (
            <div key={group.label} className="p-5">
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
                {group.label}
              </p>
              <div className="space-y-1">
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
                      onClick={onClose}
                      className="group/link flex flex-col gap-0.5 px-3 py-2.5 -mx-1 rounded-lg hover:bg-[#161616] transition-colors duration-150"
                      {...extraProps}
                    >
                      <span className="text-[14px] font-medium text-[#e0e0e0] group-hover/link:text-white transition-colors flex items-center">
                        {item.label}
                        {isExternal && <ExternalIcon />}
                      </span>
                      {item.desc && (
                        <span className="text-[12px] text-[#555] group-hover/link:text-[#777] transition-colors leading-snug">
                          {item.desc}
                        </span>
                      )}
                    </Comp>
                  );
                })}
              </div>
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
    <div className="border-b border-[#1a1a1a] last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-3.5 text-[15px] font-medium text-[#ccc] hover:text-white transition-colors"
      >
        {menu.label}
        <ChevronDown open={expanded} />
      </button>

      {expanded && (
        <div className="pb-3 px-2">
          {menu.groups.map((group) => (
            <div key={group.label} className="mb-3 last:mb-0">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#555] px-4 mb-2">
                {group.label}
              </p>
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
                    onClick={onClose}
                    className="group/link flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#161616] transition-colors"
                    {...extraProps}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] text-[#ccc] group-hover/link:text-white transition-colors flex items-center">
                        {item.label}
                        {isExternal && <ExternalIcon />}
                      </span>
                      {item.desc && (
                        <span className="text-[11px] text-[#555] block mt-0.5">{item.desc}</span>
                      )}
                    </div>
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
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
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[60] backdrop-blur-md ${
        mobileMenuOpen ? "bg-black" : "bg-black/90"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Ultron" width={32} height={32} className="rounded-sm" />
            <span className="font-bold text-white text-lg tracking-tight">Ultron</span>
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
                  className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors duration-150 ${
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
            {/* Try Ultron — desktop only */}
            <Link
              href="https://app.51ultron.com/signup"
              className="hidden md:inline-flex text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-5 py-1.5 hover:bg-[#DA4E24]/10 transition-colors"
            >
              Try Ultron
            </Link>

            {/* Burger menu — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#999] hover:text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-[#1a1a1a] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="py-2">
            {NAV_MENUS.map((menu) => (
              <MobileAccordion
                key={menu.label}
                menu={menu}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Try Ultron CTA */}
            <div className="px-4 pt-4 pb-5">
              <Link
                href="https://app.51ultron.com/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-5 py-2.5 hover:bg-[#DA4E24]/10 transition-colors"
              >
                Try Ultron
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
