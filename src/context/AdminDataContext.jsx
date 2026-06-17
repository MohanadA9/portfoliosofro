/**
 * AdminDataContext.jsx
 *
 * Data layer for the admin dashboard.
 * All data fetched from real API via Supabase Edge Functions.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";

function useApiList(apiUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(apiUrl, "GET");
      const items = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setData(items);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

function useApiObject(apiUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(apiUrl, "GET");
      setData(res?.data ?? res ?? null);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// ── Contexts ─────────────────────────────────────────────────────────────────
const AchievementsCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const ResearchesCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const ExperiencesCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const PositionsCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const CoursesCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const BlogsCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const MessagesCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const EducationCtx = createContext({ data: [], loading: true, error: null, reload: () => {} });
const ProfessorCtx = createContext({ data: null, loading: true, error: null, reload: () => {} });
const AboutCtx = createContext({ data: null, loading: true, error: null, reload: () => {} });
const SettingsCtx = createContext({ data: null, loading: true, error: null, reload: () => {} });

// ── Public hooks (consumed by admin pages) ────────────────────────────────────
export const useAdminAchievements = () => useContext(AchievementsCtx);
export const useAdminResearches = () => useContext(ResearchesCtx);
export const useAdminExperiences = () => useContext(ExperiencesCtx);
export const useAdminPositions = () => useContext(PositionsCtx);
export const useAdminCourses = () => useContext(CoursesCtx);
export const useAdminBlogs = () => useContext(BlogsCtx);
export const useAdminMessages = () => useContext(MessagesCtx);
export const useAdminEducation = () => useContext(EducationCtx);
export const useAdminProfessor = () => useContext(ProfessorCtx);
export const useAdminAbout = () => useContext(AboutCtx);
export const useAdminSettings = () => useContext(SettingsCtx);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AdminDataProvider({ children }) {
  const achievements = useApiList(EP.achievements.list);
  const researches = useApiList(EP.researches.list);
  const experiences = useApiList(EP.experiences.list);
  const positions = useApiList(EP.positions.list);
  const courses = useApiList(EP.courses.list);
  const blogs = useApiList(EP.blogs.list);
  const messages = useApiList(EP.messages.list);
  const education = useApiList(EP.education.list);
  const professor = useApiObject(EP.user.get);
  const about = useApiObject(EP.about.get);
  const settings = useApiObject(EP.settings.get);

  return (
    <AchievementsCtx.Provider value={achievements}>
      <ResearchesCtx.Provider value={researches}>
        <ExperiencesCtx.Provider value={experiences}>
          <PositionsCtx.Provider value={positions}>
            <CoursesCtx.Provider value={courses}>
              <BlogsCtx.Provider value={blogs}>
                <MessagesCtx.Provider value={messages}>
                  <EducationCtx.Provider value={education}>
                    <ProfessorCtx.Provider value={professor}>
                        <AboutCtx.Provider value={about}>
                          <SettingsCtx.Provider value={settings}>
                                {children}
                          </SettingsCtx.Provider>
                        </AboutCtx.Provider>
                    </ProfessorCtx.Provider>
                  </EducationCtx.Provider>
                </MessagesCtx.Provider>
              </BlogsCtx.Provider>
            </CoursesCtx.Provider>
          </PositionsCtx.Provider>
        </ExperiencesCtx.Provider>
      </ResearchesCtx.Provider>
    </AchievementsCtx.Provider>
  );
}
