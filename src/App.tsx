import { Routes, Route, Link } from "react-router-dom";

import PublicLayout from "./routes/_public";
import HomePage from "./routes/_public.index";
import AboutPage from "./routes/_public.about";
import AchievementsPage from "./routes/_public.achievements.index";
import AchievementDetail from "./routes/_public.achievements.$id";
import BlogPage from "./routes/_public.blog.index";
import BlogDetail from "./routes/_public.blog.$id";
import ContactPage from "./routes/_public.contact";
import CoursesPage from "./routes/_public.courses.index";
import CourseDetail from "./routes/_public.courses.$id";
import ExperiencesPage from "./routes/_public.experiences";
import PositionsPage from "./routes/_public.positions";
import ResearchesPage from "./routes/_public.researches.index";
import ResearchDetail from "./routes/_public.researches.$id";

import AdminLayout from "./routes/_admin";
import DashboardHome from "./routes/_admin.admin.index";
import AdminAchievements from "./routes/_admin.admin.achievements";
import AdminBlogs from "./routes/_admin.admin.blogs";
import AdminCourses from "./routes/_admin.admin.courses";
import AdminEducation from "./routes/_admin.admin.education";
import AdminExperiences from "./routes/_admin.admin.experiences";
import LecturesPage from "./routes/_admin.admin.lectures";
import MediaPage from "./routes/_admin.admin.media";
import MessagesPage from "./routes/_admin.admin.messages";
import AdminPositions from "./routes/_admin.admin.positions";
import ProfilePage from "./routes/_admin.admin.profile";
import AdminResearches from "./routes/_admin.admin.researches";
import SettingsPage from "./routes/_admin.admin.settings";

import LoginPage from "./routes/login";
import ForgotPage from "./routes/forgot-password";
import OtpPage from "./routes/otp";
import ResetPage from "./routes/reset-password";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric">404 • Signal lost</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The frequency you tuned into doesn't exist or has been retired.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
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

      <Route element={<AdminLayout />}>
        <Route path="admin" element={<DashboardHome />} />
        <Route path="admin/achievements" element={<AdminAchievements />} />
        <Route path="admin/blogs" element={<AdminBlogs />} />
        <Route path="admin/courses" element={<AdminCourses />} />
        <Route path="admin/education" element={<AdminEducation />} />
        <Route path="admin/experiences" element={<AdminExperiences />} />
        <Route path="admin/lectures" element={<LecturesPage />} />
        <Route path="admin/media" element={<MediaPage />} />
        <Route path="admin/messages" element={<MessagesPage />} />
        <Route path="admin/positions" element={<AdminPositions />} />
        <Route path="admin/profile" element={<ProfilePage />} />
        <Route path="admin/researches" element={<AdminResearches />} />
        <Route path="admin/settings" element={<SettingsPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPage />} />
      <Route path="otp" element={<OtpPage />} />
      <Route path="reset-password" element={<ResetPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
