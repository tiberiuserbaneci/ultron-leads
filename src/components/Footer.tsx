import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-10">
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
                  { label: "Agent Blueprint", href: "#" },
                  { label: "Classified Log", href: "#" },
                  { label: "ROI Calculator", href: "#" },
                  { label: "$10K Stack", href: "/stack" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-[#999] mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Integrations", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Resources", href: "#" },
                  { label: "DealMaker", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Others */}
            <div>
              <h4 className="text-sm font-semibold text-[#999] mb-4">Others</h4>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms & Condition", href: "#" },
                  { label: "OpenClaw", href: "#" },
                  { label: "NXT Enterprises", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-[#222] px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#666]">&copy; 2026 Powered by NXT Enterprises</span>
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* Telegram */}
            <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="Telegram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
