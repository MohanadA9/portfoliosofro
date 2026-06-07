import { Link } from "react-router-dom";
import { Linkedin, Github, Twitter, Mail, Radio } from "lucide-react";
import { professor } from "@/data/mockData";

export function PublicFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-card/40 mt-24">
      <div className="container-academic py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Radio className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="font-display font-bold">{professor.name}</p>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {professor.department}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Research, teaching, and academic leadership at the frontier of wireless
            communications and 6G systems.
          </p>
        </div>
        <div>
          <p className="font-display font-semibold mb-3 text-sm">Explore</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/researches" className="hover:text-foreground">Research</Link></li>
            <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display font-semibold mb-3 text-sm">Connect</p>
          <div className="flex gap-2">
            {[
              { Icon: Linkedin, href: professor.socials.linkedin },
              { Icon: Github, href: professor.socials.github },
              { Icon: Twitter, href: professor.socials.twitter },
              { Icon: Mail, href: `mailto:${professor.email}` },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                 className="grid size-9 place-items-center rounded-md border border-border bg-background hover:border-electric/60 hover:text-electric transition">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-academic flex flex-col md:flex-row items-center justify-between gap-2 py-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {professor.name}. All rights reserved.</p>
          <p className="font-mono">Built with signal & precision.</p>
        </div>
      </div>
    </footer>
  );
}
