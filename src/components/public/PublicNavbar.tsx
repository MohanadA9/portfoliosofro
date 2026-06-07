import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Moon, Sun, Radio } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/researches", label: "Research" },
  { to: "/achievements", label: "Achievements" },
  { to: "/experiences", label: "Experience" },
  { to: "/positions", label: "Positions" },
  { to: "/courses", label: "Courses" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function PublicNavbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="container-academic flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground glow-sm">
            <Radio className="size-4" />
            <span className="absolute inset-0 rounded-lg ring-1 ring-electric/40 group-hover:ring-electric transition" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">Prof. K. Mansour</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">ECE • CIT</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-electric"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="grid size-9 place-items-center rounded-md border border-border bg-card hover:border-electric/60 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            to="/contact"
            className="hidden sm:inline-flex h-9 items-center rounded-md bg-electric px-3 text-sm font-medium text-electric-foreground hover:opacity-90 transition glow-sm"
          >
            Get in touch
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden grid size-9 place-items-center rounded-md border border-border">
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container-academic flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
