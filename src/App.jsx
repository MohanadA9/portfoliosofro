import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AdminDataProvider } from "./context/AdminDataContext";
import { ThemeProvider } from "./context/ThemeContext";

// Public Pages
import PublicLayout from "./pages/_public";
import HomePage from "./pages/_public.index";
import AboutPage from "./pages/_public.about";
import AchievementsPage from "./pages/_public.achievements.index";
import AchievementDetail from "./pages/_public.achievements.$id";
import BlogPage from "./pages/_public.blog.index";
import BlogDetail from "./pages/_public.blog.$id";
import ContactPage from "./pages/_public.contact";
import CoursesPage from "./pages/_public.courses.index";
import CourseDetail from "./pages/_public.courses.$id";
import ExperiencesPage from "./pages/_public.experiences";
import PositionsPage from "./pages/_public.positions";
import ResearchesPage from "./pages/_public.researches.index";
import ResearchDetail from "./pages/_public.researches.$id";

// Admin Pages
import AdminLayout from "./pages/admin/Layout";
import DashboardHome from "./pages/admin/_admin.admin.index";
import AdminAchievements from "./pages/admin/_admin.admin.achievements";
import AchievementForm from "./pages/admin/_admin.admin.achievements.form";
import AdminBlogs from "./pages/admin/_admin.admin.blogs";
import AdminCourses from "./pages/admin/_admin.admin.courses";
import AdminEducation from "./pages/admin/_admin.admin.education";
import AdminExperiences from "./pages/admin/_admin.admin.experiences";
import LecturesPage from "./pages/admin/_admin.admin.lectures";
import MessagesPage from "./pages/admin/_admin.admin.messages";
import AdminPositions from "./pages/admin/_admin.admin.positions";
import ProfilePage from "./pages/admin/_admin.admin.profile";
import AdminResearches from "./pages/admin/_admin.admin.researches";
import ResearchForm from "./pages/admin/_admin.admin.researches.form";
import SettingsPage from "./pages/admin/_admin.admin.settings";

// Auth Pages
import LoginPage from "./pages/login";
import ForgotPage from "./pages/forgot-password";
import OtpPage from "./pages/otp";
import ResetPage from "./pages/reset-password";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric">
          404 • Signal lost
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The frequency you tuned into doesn't exist or has been retired.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    /* DataProvider  → public pages always read from JSON */
    /* AdminDataProvider → admin pages: JSON (MOCK_MODE=true) or real API (MOCK_MODE=false) */
    <DataProvider>
      <AdminDataProvider>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* ── Public ── */}
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="achievements/:id" element={<AchievementDetail />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="experiences" element={<ExperiencesPage />} />
                <Route path="positions" element={<PositionsPage />} />
                <Route path="researches" element={<ResearchesPage />} />
                <Route path="researches/:id" element={<ResearchDetail />} />
              </Route>

              {/* ── Admin ── */}
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<DashboardHome />} />
                <Route path="admin/achievements" element={<AdminAchievements />} />
                <Route path="admin/achievements/new" element={<AchievementForm />} />
                <Route path="admin/achievements/:id/edit" element={<AchievementForm />} />
                <Route path="admin/blogs" element={<AdminBlogs />} />
                <Route path="admin/courses" element={<AdminCourses />} />
                <Route path="admin/education" element={<AdminEducation />} />
                <Route path="admin/experiences" element={<AdminExperiences />} />
                <Route path="admin/lectures" element={<LecturesPage />} />
                <Route path="admin/messages" element={<MessagesPage />} />
                <Route path="admin/positions" element={<AdminPositions />} />
                <Route path="admin/profile" element={<ProfilePage />} />
                <Route path="admin/researches" element={<AdminResearches />} />
                <Route path="admin/researches/new" element={<ResearchForm />} />
                <Route path="admin/researches/:id/edit" element={<ResearchForm />} />
                <Route path="admin/settings" element={<SettingsPage />} />
              </Route>

              {/* ── Auth ── */}
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPage />} />
              <Route path="otp" element={<OtpPage />} />
              <Route path="reset-password" element={<ResetPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </AdminDataProvider>
    </DataProvider>
  );
}
