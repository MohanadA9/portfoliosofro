import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Profile", href: "/admin/profile", icon: "👤" },
    { label: "Courses", href: "/admin/courses", icon: "📚" },
    { label: "Researches", href: "/admin/researches", icon: "🔬" },
    { label: "Achievements", href: "/admin/achievements", icon: "🏆" },
    { label: "Education", href: "/admin/education", icon: "🎓" },
    { label: "Experience", href: "/admin/experiences", icon: "💼" },
    { label: "Positions", href: "/admin/positions", icon: "📍" },
    { label: "Blogs", href: "/admin/blogs", icon: "📝" },
    { label: "Media", href: "/admin/media", icon: "🖼️" },
    { label: "Messages", href: "/admin/messages", icon: "💬" },
    { label: "Lectures", href: "/admin/lectures", icon: "🎤" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-muted rounded"
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted transition-colors"
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 text-sm"
          >
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name || "Admin"}</span>
            <img
              src={user?.avatar || "https://via.placeholder.com/40"}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
