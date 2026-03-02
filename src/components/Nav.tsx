import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-black/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="https://51ultron.com" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Ultron"
              width={36}
              height={36}
              className="rounded-sm"
            />
            <span className="font-bold text-white text-xl tracking-tight group-hover:text-[#DA4E24] transition-colors">
              Ultron
            </span>
          </Link>

          <Link
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-1.5 btn-gradient glow-accent text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            Try Ultron
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
