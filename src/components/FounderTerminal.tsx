export default function FounderTerminal() {
  return (
    <div className="mt-8 p-6 sm:p-8 bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#2a2a2a] rounded-full px-3 py-1 mb-3">
            <span className="text-[#999] text-xs font-medium">Free Resources</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Founder Terminal</h3>
          <p className="text-sm text-[#666] leading-relaxed max-w-md">
            Free playbooks, frameworks, and execution models for founders building with AI agents. New breakdown every week.
          </p>
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
          <a
            href="https://catalinfetean.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#f0f0f0] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            Subscribe now
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
