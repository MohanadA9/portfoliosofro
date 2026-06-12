import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  Radio,
  Home,
  User,
  FlaskConical,
  Award,
  Briefcase,
  UserCheck,
  BookOpen,
  Newspaper,
  Mail,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { AnimatePresence, motion } from "framer-motion";
const links = [
  {
    to: "/",
    label: "Home",
    icon: Home,
  },
  {
    to: "/about",
    label: "About",
    icon: User,
  },
  {
    to: "/researches",
    label: "Research",
    icon: FlaskConical,
  },
  {
    to: "/achievements",
    label: "Achievements",
    icon: Award,
  },
  {
    to: "/experiences",
    label: "Experience",
    icon: Briefcase,
  },
  {
    to: "/positions",
    label: "Positions",
    icon: UserCheck,
  },
  {
    to: "/courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    to: "/blog",
    label: "Blog",
    icon: Newspaper,
  },
  {
    to: "/contact",
    label: "Contact",
    icon: Mail,
  },
];
// Primary destinations shown directly in the Facebook-style bottom tab bar.
const bottomLinks = [
  links[0], // Home
  links[2], // Research
  links[6], // Courses
  links[7], // Blog
];
function isActive(to, path) {
  return to === "/" ? path === "/" : path.startsWith(to);
}
export function PublicNavbar() {
  const { theme, toggle } = useTheme();
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
        <div className="container-academic flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-primary text-primary-foreground glow-sm">
              {settings?.icon ? (
                <img
                  src={settings.icon}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Radio className="size-4" />
              )}
              <span className="absolute inset-0 rounded-lg ring-1 ring-electric/40 group-hover:ring-electric transition" />
            </span>
            <div className="leading-tight">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                ECE • CIT
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = isActive(l.to, path);
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
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <Link
              to="/contact"
              className="hidden sm:inline-flex h-9 items-center rounded-md bg-electric px-3 text-sm font-medium text-electric-foreground hover:opacity-90 transition glow-sm"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </header>

      {/* Facebook-style bottom tab bar (small screens) */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {bottomLinks.map((l) => {
            const active = isActive(l.to, path);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-electric"
                  />
                )}
                <Icon
                  className={`size-5 transition ${
                    active ? "text-electric" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={
                    active ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {l.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
            aria-label="Open menu"
          >
            <Menu className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full menu sheet opened from the bottom bar's "Menu" tab */}
      <AnimatePresence>
        {open && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-center justify-between px-1 pb-3">
                <p className="font-display text-sm font-bold">Menu</p>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-items-center rounded-md border border-border"
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {links.map((l) => {
                  const active = isActive(l.to, path);
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-medium transition ${
                        active
                          ? "border-electric/60 bg-electric/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-electric/40"
                      }`}
                    >
                      <Icon
                        className={`size-5 ${active ? "text-electric" : ""}`}
                      />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 flex h-11 items-center justify-center rounded-md bg-electric px-3 text-sm font-medium text-electric-foreground hover:opacity-90 transition glow-sm"
              >
                Get in touch
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
