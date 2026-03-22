import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-20">
      <div className="rounded-2xl border border-[#222] bg-black">
        {/* Footer main content */}
        <div className="p-8 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Ultron" width={40} height={40} className="rounded-sm" />
                <span className="text-2xl font-bold">Ultron</span>
              </div>
              <p className="text-[#999] text-sm leading-relaxed">
                The growth engine behind
                <br />
                founder-led businesses.
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
                    <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
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
                  { label: "Documentation", href: "https://docs.51ultron.com/get-started/introduction" },
                  { label: "Automation Quiz", href: "/assess" },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("http") ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#ccc] hover:text-white transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
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
                  { label: "Playbooks", href: "https://catalinfetean.substack.com/" },
                  { label: "DealMaker", href: "https://dealmaker.nexitynetwork.org/" },
                  { label: "NXT Enterprises", href: "https://nexitynetwork.org/" },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("http") ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#ccc] hover:text-white transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-[#222] px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#666]">&copy; 2026 Powered by NXT Enterprises</span>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-[#666] hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-[#666] hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
