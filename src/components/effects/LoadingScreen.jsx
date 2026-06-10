import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
const STEPS = [
  "Initializing radio frontend…",
  "Calibrating antenna array…",
  "Establishing uplink…",
  "Decoding signal…",
  "System online.",
];
export function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s < STEPS.length - 1 ? s + 1 : s)), 420);
    const to = setTimeout(() => {
      setVisible(false);
      onDone?.();
      clearInterval(iv);
    }, 2400);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [onDone]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-deep"
        >
          <div className="relative flex flex-col items-center gap-8">
            {/* Radar */}
            <div className="relative size-56">
              <div className="absolute inset-0 rounded-full border border-electric/30" />
              <div className="absolute inset-6 rounded-full border border-electric/20" />
              <div className="absolute inset-12 rounded-full border border-electric/10" />
              <div className="absolute inset-0 animate-radar">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--electric) 55%, transparent) 50deg, transparent 100deg)",
                  }}
                />
              </div>
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric glow-sm" />
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric animate-pulse-ring"
                  style={{
                    animationDelay: `${i * 0.7}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
                CIT • ECE
              </p>
              <p className="font-display text-lg text-foreground">Establishing Secure Channel</p>
              <motion.p
                key={step}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="font-mono text-xs text-muted-foreground"
              >
                {STEPS[step]}
              </motion.p>
            </div>

            <div className="h-1 w-64 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut",
                }}
                className="h-full bg-electric glow-sm"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
