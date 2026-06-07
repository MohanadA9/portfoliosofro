import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Card({ children, className = "", hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition hover:border-electric/50 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--electric)_30%,transparent)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function CoverCard({
  to, cover, eyebrow, title, meta, footer,
}: {
  to?: string;
  cover: string;
  eyebrow?: string;
  title: string;
  meta?: ReactNode;
  footer?: ReactNode;
}) {
  const content = (
    <Card className="h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={cover} alt={title} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        {eyebrow && (
          <span className="absolute top-3 left-3 rounded-full bg-electric/90 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-electric-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-2 group-hover:text-electric transition">{title}</h3>
        {meta && <div className="text-sm text-muted-foreground line-clamp-3">{meta}</div>}
        {footer && <div className="mt-auto pt-3 text-xs text-muted-foreground">{footer}</div>}
      </div>
    </Card>
  );
  return to ? <Link to={to as any} className="block h-full">{content}</Link> : content;
}
