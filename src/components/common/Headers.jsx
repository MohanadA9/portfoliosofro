import { motion } from "framer-motion";
export function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div
      className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""} mb-10`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-electric">
          <span className="size-1.5 rounded-full bg-electric animate-pulse" /> {eyebrow}
        </span>
      )}
      <motion.h2
        initial={{
          opacity: 0,
          y: 12,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: "-80px",
        }}
        className="font-display text-3xl md:text-4xl font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && <p className="max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative border-b border-border/60 bg-card/30">
      <div className="container-academic py-14 md:py-20">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
