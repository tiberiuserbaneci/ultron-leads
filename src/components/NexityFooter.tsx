import Link from "next/link";
import Image from "next/image";

export default function NexityFooter() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/nxt-enterprises.png" alt="NXT" width={32} height={32} />
              <span className="text-xl font-bold text-[#1a1a1a]">NXT Enterprises</span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed">
              AI and blockchain infrastructure
              <br />
              for the autonomous economy.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[#999] mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Interactive Demo", href: "/demo" },
                { label: "Agent Blueprint", href: "/blueprint" },
                { label: "Dashboard", href: "/live" },
                { label: "Pricing", href: "/pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[#999] mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Library", href: "/library" },
                { label: "ROI Calculator", href: "/calculator" },
                { label: "Documentation", href: "https://docs.51ultron.com/get-started/introduction", external: true },
                { label: "Automation Quiz", href: "/assess" },
              ].map((item) => (
                <li key={item.label}>
                  {"external" in item && item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[#999] mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Contact Sales", href: "/contact" },
                { label: "Playbooks", href: "https://catalinfetean.substack.com/", external: true },
                { label: "DealMaker", href: "https://dealmaker.nexitynetwork.org/", external: true },
              ].map((item) => (
                <li key={item.label}>
                  {"external" in item && item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-[#555] hover:text-[#1a1a1a] transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <span className="text-sm text-[#999]">&copy; 2026 NXT Enterprises</span>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-[#999] hover:text-[#1a1a1a] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-[#999] hover:text-[#1a1a1a] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
