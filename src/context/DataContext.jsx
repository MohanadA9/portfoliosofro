import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/api/request";
import { PORTFOLIO_ENDPOINTS as PUB } from "@/api/endpoints";

function useApiData(fetcher, defaultValue) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      const extracted = res?.data !== undefined ? res.data : res;
      setData(extracted ?? defaultValue);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

const ProfessorContext = createContext({ data: null, loading: true, error: null, reload: () => {} });
const AboutContext = createContext({ data: null, loading: true, error: null, reload: () => {} });
const EducationContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const ExperienceContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const CoursesContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const ResearchesContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const AchievementsContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const BlogsContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const MessagesContext = createContext({ data: [], loading: true, error: null, reload: () => {} });
const SettingsContext = createContext({ data: null, loading: true, error: null, reload: () => {} });
const PositionsContext = createContext({ data: [], loading: true, error: null, reload: () => {} });

export const useProfessor = () => useContext(ProfessorContext);
export const useAbout = () => useContext(AboutContext);
export const useEducation = () => useContext(EducationContext);
export const useExperience = () => useContext(ExperienceContext);
export const useCourses = () => useContext(CoursesContext);
export const useResearches = () => useContext(ResearchesContext);
export const useAchievements = () => useContext(AchievementsContext);
export const useBlogs = () => useContext(BlogsContext);
export const useMessages = () => useContext(MessagesContext);
export const useSettings = () => useContext(SettingsContext);
export const usePositions = () => useContext(PositionsContext);

export const DataProvider = ({ children }) => {
  const professor = useApiData(() => apiFetch(PUB.profile.get, "GET"), null);
  const about = useApiData(() => apiFetch(PUB.about.get, "GET"), null);
  const settings = useApiData(() => apiFetch(PUB.settings.get, "GET"), null);
  const education = useApiData(() => apiFetch(PUB.education.list, "GET"), []);
  const experiences = useApiData(() => apiFetch(PUB.experiences.list, "GET"), []);
  const courses = useApiData(() => apiFetch(PUB.courses.list, "GET"), []);
  const researches = useApiData(() => apiFetch(PUB.researches.list, "GET"), []);
  const achievements = useApiData(() => apiFetch(PUB.achievements.list, "GET"), []);
  const blogs = useApiData(() => apiFetch(PUB.blogs.list, "GET"), []);
  const positions = useApiData(() => apiFetch(PUB.positions.list, "GET"), []);
  const messages = useApiData(() => apiFetch(PUB.blogs.list, "GET"), []);

  return (
    <ProfessorContext.Provider value={professor}>
      <AboutContext.Provider value={about}>
        <EducationContext.Provider value={education}>
          <ExperienceContext.Provider value={experiences}>
            <CoursesContext.Provider value={courses}>
              <ResearchesContext.Provider value={researches}>
                <AchievementsContext.Provider value={achievements}>
                  <BlogsContext.Provider value={blogs}>
                    <SettingsContext.Provider value={settings}>
                      <PositionsContext.Provider value={positions}>
                        <MessagesContext.Provider value={messages}>
                          {children}
                        </MessagesContext.Provider>
                      </PositionsContext.Provider>
                    </SettingsContext.Provider>
                  </BlogsContext.Provider>
                </AchievementsContext.Provider>
              </ResearchesContext.Provider>
            </CoursesContext.Provider>
          </ExperienceContext.Provider>
        </EducationContext.Provider>
      </AboutContext.Provider>
    </ProfessorContext.Provider>
  );
};
