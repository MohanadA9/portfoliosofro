import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Award, Briefcase, FileText, Crown, BookOpen, Video, Edit3,
  MessageSquare, Image, User, Settings, LogOut, Radio, Moon, Sun, Bell, GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: React.ComponentType<any>; exact?: boolean };
const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/researches", label: "Researches", icon: FileText },
  { to: "/admin/positions", label: "Positions", icon: Crown },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/lectures", label: "Lectures", icon: Video },
  { to: "/admin/blogs", label: "Blogs", icon: Edit3 },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/media", label: "Media Library", icon: Image },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const path = useLocation().pathname;

  const onLogout = () => { logout(); toast.success("Signed out"); nav("/login"); };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground glow-sm"><Radio className="size-4" /></span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold">Admin Console</p>
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">ECE • CIT</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {items.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? path === to : path.startsWith(to);
            return (
              <Link key={to} to={to as any}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/30 glow-sm"
                         : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}>
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={onLogout} className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-4 sticky top-0 z-30">
          <p className="text-sm text-muted-foreground">Welcome back, <span className="text-foreground font-medium">{user?.name ?? "Professor"}</span></p>
          <div className="ml-auto flex items-center gap-2">
            <button className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 relative">
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-electric" />
            </button>
            <button onClick={toggle} className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link to="/" className="hidden sm:inline-flex h-9 items-center rounded-md border border-border px-3 text-xs hover:border-electric/60">View site</Link>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
