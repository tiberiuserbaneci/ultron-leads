"use client";

export type BrainState =
  | "idle"
  | "listening"
  | "transcribing"
  | "thinking"
  | "dispatching"
  | "resolved";

interface BrainOrbProps {
  state: BrainState;
  compact?: boolean;
}

export default function BrainOrb({ state, compact }: BrainOrbProps) {
  const size = compact ? 280 : 420;
  const center = size / 2;
  const isActive = state !== "idle";

  const stateColors: Record<BrainState, { core: string; glow: string; particle: string }> = {
    idle: { core: "#DA4E24", glow: "rgba(218,78,36,0.15)", particle: "rgba(218,78,36,0.4)" },
    listening: { core: "#FF7847", glow: "rgba(255,120,71,0.25)", particle: "rgba(255,120,71,0.6)" },
    transcribing: { core: "#FF8C5A", glow: "rgba(255,140,90,0.2)", particle: "rgba(255,140,90,0.5)" },
    thinking: { core: "#DA4E24", glow: "rgba(218,78,36,0.3)", particle: "rgba(218,78,36,0.7)" },
    dispatching: { core: "#FF7847", glow: "rgba(255,120,71,0.35)", particle: "rgba(255,120,71,0.8)" },
    resolved: { core: "#DA4E24", glow: "rgba(218,78,36,0.12)", particle: "rgba(218,78,36,0.3)" },
  };

  const colors = stateColors[state];

  const rings = compact
    ? [
        { r: 40, dash: "3 8", speed: 40, opacity: 0.5 },
        { r: 60, dash: "6 12", speed: 55, opacity: 0.35 },
        { r: 82, dash: "2 16", speed: 70, opacity: 0.2 },
        { r: 105, dash: "4 20", speed: 90, opacity: 0.12 },
      ]
    : [
        { r: 55, dash: "3 8", speed: 40, opacity: 0.5 },
        { r: 80, dash: "6 12", speed: 55, opacity: 0.35 },
        { r: 108, dash: "2 16", speed: 70, opacity: 0.25 },
        { r: 138, dash: "4 20", speed: 90, opacity: 0.15 },
        { r: 170, dash: "1 24", speed: 120, opacity: 0.08 },
      ];

  const particles = Array.from({ length: compact ? 8 : 14 }, (_, i) => {
    const angle = (i / (compact ? 8 : 14)) * Math.PI * 2;
    const baseR = compact ? 90 : 135;
    const variance = 20 + (i % 3) * 15;
    return {
      cx: center + Math.cos(angle) * (baseR + (i % 2 === 0 ? variance : -variance * 0.3)),
      cy: center + Math.sin(angle) * (baseR + (i % 2 === 0 ? -variance * 0.5 : variance)),
      r: 1.2 + (i % 3) * 0.6,
      delay: i * 0.3,
      duration: 2.5 + (i % 4) * 0.8,
    };
  });

  return (
    <div className="brain-orb-container relative" style={{ width: size, height: size }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
          transform: isActive ? "scale(1.2)" : "scale(1)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={colors.core} stopOpacity="0.9" />
            <stop offset="60%" stopColor={colors.core} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.core} stopOpacity="0" />
          </radialGradient>
          <filter id="coreGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Orbit rings */}
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={ring.r}
            fill="none"
            stroke={colors.core}
            strokeWidth={isActive ? 1 : 0.5}
            strokeOpacity={isActive ? ring.opacity * 1.5 : ring.opacity}
            strokeDasharray={ring.dash}
            className="brain-ring"
            style={{
              animationDuration: `${ring.speed * (isActive ? 0.5 : 1)}s`,
              transformOrigin: `${center}px ${center}px`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          />
        ))}

        {/* Signal particles */}
        {particles.map((p, i) => (
          <circle
            key={`p${i}`}
            cx={p.cx}
            cy={p.cy}
            r={isActive ? p.r * 1.5 : p.r}
            fill={colors.particle}
            filter="url(#particleGlow)"
            className="brain-particle"
            style={{
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration * (isActive ? 0.6 : 1)}s`,
              transformOrigin: `${center}px ${center}px`,
            }}
          />
        ))}

        {/* Waveform ring for listening state */}
        {(state === "listening" || state === "transcribing") && (
          <>
            <circle
              cx={center}
              cy={center}
              r={compact ? 48 : 65}
              fill="none"
              stroke={colors.core}
              strokeWidth="1.5"
              strokeOpacity="0.4"
              className="brain-wave"
            />
            <circle
              cx={center}
              cy={center}
              r={compact ? 56 : 75}
              fill="none"
              stroke={colors.core}
              strokeWidth="1"
              strokeOpacity="0.25"
              className="brain-wave"
              style={{ animationDelay: "0.3s" }}
            />
            <circle
              cx={center}
              cy={center}
              r={compact ? 64 : 85}
              fill="none"
              stroke={colors.core}
              strokeWidth="0.5"
              strokeOpacity="0.15"
              className="brain-wave"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}

        {/* Dispatch lines */}
        {state === "dispatching" &&
          [0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const innerR = compact ? 50 : 70;
            const outerR = compact ? 110 : 165;
            return (
              <line
                key={`d${i}`}
                x1={center + Math.cos(rad) * innerR}
                y1={center + Math.sin(rad) * innerR}
                x2={center + Math.cos(rad) * outerR}
                y2={center + Math.sin(rad) * outerR}
                stroke={colors.core}
                strokeWidth="1"
                strokeOpacity="0.5"
                className="brain-dispatch-line"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}

        {/* Core orb */}
        <circle
          cx={center}
          cy={center}
          r={compact ? 28 : 38}
          fill="url(#coreGrad)"
          filter="url(#coreGlow)"
          className={isActive ? "brain-core-active" : "brain-core-idle"}
        />

        {/* Core inner highlight */}
        <circle
          cx={center}
          cy={center - (compact ? 4 : 6)}
          r={compact ? 10 : 14}
          fill={colors.core}
          fillOpacity="0.25"
        />
      </svg>

      {/* State label */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className="text-[10px] font-terminal uppercase tracking-[0.2em] text-[#DA4E24]">
            {state === "listening" && "Listening..."}
            {state === "transcribing" && "Processing..."}
            {state === "thinking" && "Interpreting..."}
            {state === "dispatching" && "Dispatching..."}
            {state === "resolved" && "Complete"}
          </span>
        </div>
      )}
    </div>
  );
}
