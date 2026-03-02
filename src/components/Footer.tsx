import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0A0A0A] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm text-neutral-400">Powered by Ultron OS</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="https://51ultron.com" className="hover:text-orange-400 transition-colors">
              51ultron.com
            </Link>
            <Link href="https://docs.51ultron.com" className="hover:text-orange-400 transition-colors">
              docs.51ultron.com
            </Link>
            <Link href="https://app.51ultron.com" className="hover:text-orange-400 transition-colors">
              app.51ultron.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
