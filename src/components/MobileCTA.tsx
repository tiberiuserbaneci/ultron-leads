import Link from "next/link";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#111111] border-t border-[#1a1a1a] p-3">
      <Link
        href="https://app.51ultron.com/signup"
        className="block w-full text-center bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm"
      >
        Deploy Your AI Team — Free
      </Link>
    </div>
  );
}
