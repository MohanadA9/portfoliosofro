import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Award,
  Briefcase,
  FileText,
  Crown,
  BookOpen,
  Video,
  Edit3,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Radio,
  Moon,
  Sun,
  Bell,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

const items = [
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
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ path, onNavigate, onLogout }) {
  return (
    <>
      <div className="p-5 border-b border-sidebar-border shrink-0">
        <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground glow-sm">
            <Radio className="size-4" />
          </span>
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
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/30 glow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </>
  );
}

export function AdminShell({ children }) {
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const path = useLocation().pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    toast.success("Signed out");
    nav("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen">
        <SidebarContent path={path} onNavigate={() => {}} onLogout={onLogout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <X className="size-4" />
        </button>
        <SidebarContent path={path} onNavigate={() => setMobileOpen(false)} onLogout={onLogout} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 shrink-0 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-4 z-30">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden mr-3 grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 text-muted-foreground hover:text-foreground transition"
          >
            <Menu className="size-4" />
          </button>

          <p className="text-sm text-muted-foreground">
            Welcome back,{" "}
            <span className="text-foreground font-medium">{user?.name ?? "Professor"}</span>
          </p>

          <div className="ml-auto flex items-center gap-2">
            <button className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 relative">
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-electric" />
            </button>
            <button
              onClick={toggle}
              className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/"
              className="hidden sm:inline-flex h-9 items-center rounded-md border border-border px-3 text-xs hover:border-electric/60"
            >
              View site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
