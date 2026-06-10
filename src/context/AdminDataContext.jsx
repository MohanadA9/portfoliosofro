/**
 * AdminDataContext.jsx
 *
 * Data layer for the admin dashboard.
 *
 *  MOCK_MODE = true  (request.js)  →  data loaded directly from local JSON files
 *  MOCK_MODE = false               →  data fetched from real API (DASHBOARD_ENDPOINTS)
 *
 * Public pages always use DataContext (JSON only).
 * Admin pages always use AdminDataContext.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_MODE, apiFetch } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";

// ── JSON seed data (imported at build time; used when MOCK_MODE = true) ──────
import achievementsJson from "@/data/mockData/achievements.json";
import researchesJson from "@/data/mockData/researches.json";
import experiencesJson from "@/data/mockData/experiences.json";
import positionsJson from "@/data/mockData/positions.json";
import coursesJson from "@/data/mockData/courses.json";
import blogsJson from "@/data/mockData/blogs.json";
import messagesJson from "@/data/mockData/messages.json";
import educationJson from "@/data/mockData/education.json";
import professorJson from "@/data/mockData/professor.json";
import settingsJson from "@/data/mockData/settings.json";
import statsJson from "@/data/mockData/stats.json";
import mediaJson from "@/data/mockData/media.json";
import chartsJson from "@/data/mockData/dashboardCharts.json";

// ── Generic hooks ────────────────────────────────────────────────────────────

/** Hook for a list resource (returns array). */
function useAdminList(jsonData, apiUrl) {
  const [data, setData] = useState(MOCK_MODE ? jsonData : []);

  useEffect(() => {
    if (MOCK_MODE) return;
    let active = true;
    apiFetch(apiUrl, "GET")
      .then((res) => {
        if (!active) return;
        setData(Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

/** Hook for a single-object resource (returns object or null). */
function useAdminObject(jsonData, apiUrl) {
  const [data, setData] = useState(MOCK_MODE ? jsonData : null);

  useEffect(() => {
    if (MOCK_MODE) return;
    let active = true;
    apiFetch(apiUrl, "GET")
      .then((res) => {
        if (!active) return;
        setData(res?.data ?? res ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

// ── Contexts ─────────────────────────────────────────────────────────────────
const AchievementsCtx = createContext([]);
const ResearchesCtx = createContext([]);
const ExperiencesCtx = createContext([]);
const PositionsCtx = createContext([]);
const CoursesCtx = createContext([]);
const BlogsCtx = createContext([]);
const MessagesCtx = createContext([]);
const EducationCtx = createContext([]);
const MediaCtx = createContext([]);
const ProfessorCtx = createContext(null);
const SettingsCtx = createContext(null);
const StatsCtx = createContext(null);
const ChartsCtx = createContext(null);

// ── Public hooks (consumed by admin pages) ────────────────────────────────────
export const useAdminAchievements = () => useContext(AchievementsCtx);
export const useAdminResearches = () => useContext(ResearchesCtx);
export const useAdminExperiences = () => useContext(ExperiencesCtx);
export const useAdminPositions = () => useContext(PositionsCtx);
export const useAdminCourses = () => useContext(CoursesCtx);
export const useAdminBlogs = () => useContext(BlogsCtx);
export const useAdminMessages = () => useContext(MessagesCtx);
export const useAdminEducation = () => useContext(EducationCtx);
export const useAdminMedia = () => useContext(MediaCtx);
export const useAdminProfessor = () => useContext(ProfessorCtx);
export const useAdminSettings = () => useContext(SettingsCtx);
export const useAdminStats = () => useContext(StatsCtx);
export const useAdminDashboardCharts = () => useContext(ChartsCtx);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AdminDataProvider({ children }) {
  const achievements = useAdminList(achievementsJson, EP.achievements.list);
  const researches = useAdminList(researchesJson, EP.researches.list);
  const experiences = useAdminList(experiencesJson, EP.experiences.list);
  const positions = useAdminList(positionsJson, EP.positions.list);
  const courses = useAdminList(coursesJson, EP.courses.list);
  const blogs = useAdminList(blogsJson, EP.blogs.list);
  const messages = useAdminList(messagesJson, EP.messages.list);
  const education = useAdminList(educationJson, EP.education.list);
  const media = useAdminList(mediaJson, EP.media.list);
  const professor = useAdminObject(professorJson, EP.user.get);
  const settings = useAdminObject(settingsJson, EP.settings.get);
  const stats = useAdminObject(statsJson, EP.dashboard.stats);
  const charts = useAdminObject(chartsJson, EP.dashboard.charts);

  return (
    <AchievementsCtx.Provider value={achievements}>
      <ResearchesCtx.Provider value={researches}>
        <ExperiencesCtx.Provider value={experiences}>
          <PositionsCtx.Provider value={positions}>
            <CoursesCtx.Provider value={courses}>
              <BlogsCtx.Provider value={blogs}>
                <MessagesCtx.Provider value={messages}>
                  <EducationCtx.Provider value={education}>
                    <MediaCtx.Provider value={media}>
                      <ProfessorCtx.Provider value={professor}>
                        <SettingsCtx.Provider value={settings}>
                          <StatsCtx.Provider value={stats}>
                            <ChartsCtx.Provider value={charts}>{children}</ChartsCtx.Provider>
                          </StatsCtx.Provider>
                        </SettingsCtx.Provider>
                      </ProfessorCtx.Provider>
                    </MediaCtx.Provider>
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
