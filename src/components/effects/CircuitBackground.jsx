import { motion } from "framer-motion";

/**
 * Decorative animated background — radar sweep, antenna pulses, circuit lines,
 * and floating data packets. Pure SVG / CSS; sits at z-0 behind page content.
 */
export function CircuitBackground({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />

      {/* Radar */}
      <div className="absolute -top-32 -right-32 size-[420px] rounded-full border border-electric/30">
        <div className="absolute inset-8 rounded-full border border-electric/20" />
        <div className="absolute inset-20 rounded-full border border-electric/10" />
        <div className="absolute inset-0 animate-radar">
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--electric) 40%, transparent) 40deg, transparent 80deg)",
              borderRadius: "9999px",
            }}
          />
        </div>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric animate-pulse-ring"
            style={{
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Signal lines */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--electric)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--electric)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--electric)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[120, 260, 400, 540, 680].map((y, i) => (
          <path
            key={y}
            d={`M0 ${y} Q300 ${y - 30} 600 ${y} T1200 ${y}`}
            stroke="url(#signal)"
            strokeWidth="1.2"
            fill="none"
            className="animate-signal"
            style={{
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {Array.from({
          length: 14,
        }).map((_, i) => (
          <motion.circle
            key={i}
            cx={80 + i * 80}
            cy={400 + Math.sin(i) * 80}
            r="2"
            fill="var(--electric)"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
