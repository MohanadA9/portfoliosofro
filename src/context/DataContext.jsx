import { useState, useEffect, createContext, useContext } from 'react';
import { apiGet, isAuthenticated } from '../api/request';
import { DASHBOARD_ENDPOINTS, PORTFOLIO_ENDPOINTS } from '../api/endpoints';

// Create contexts for data
const ProfessorContext = createContext(null);
const EducationContext = createContext(null);
const ExperienceContext = createContext(null);
const CoursesContext = createContext(null);
const ResearchesContext = createContext(null);
const AchievementsContext = createContext(null);
const BlogsContext = createContext(null);
const MediaContext = createContext(null);
const SettingsContext = createContext(null);
const StatsContext = createContext(null);
const PositionsContext = createContext(null);
const MessagesContext = createContext(null);

// Custom hooks for accessing data
export const useProfessor = () => useContext(ProfessorContext);
export const useEducation = () => useContext(EducationContext);
export const useExperience = () => useContext(ExperienceContext);
export const useCourses = () => useContext(CoursesContext);
export const useResearches = () => useContext(ResearchesContext);
export const useAchievements = () => useContext(AchievementsContext);
export const useBlogs = () => useContext(BlogsContext);
export const useMedia = () => useContext(MediaContext);
export const useMessages = () => useContext(MessagesContext);
export const useSettings = () => useContext(SettingsContext);
export const useStats = () => useContext(StatsContext);
export const usePositions = () => useContext(PositionsContext);

// Helper to normalize lists from various API response formats
const normalizeList = (res, keys = ['data']) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  for (const key of keys) {
    if (res[key] && Array.isArray(res[key])) return res[key];
    if (res.data && res.data[key] && Array.isArray(res.data[key])) return res.data[key];
  }
  return [];
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [professor, setProfessor] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [courses, setCourses] = useState([]);
  const [researches, setResearches] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [media, setMedia] = useState([]);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [positions, setPositions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const authed = isAuthenticated();
        
        const endpoints = [
          { key: 'professor', url: authed ? DASHBOARD_ENDPOINTS.user.get : PORTFOLIO_ENDPOINTS.profile.get },
          { key: 'education', url: authed ? DASHBOARD_ENDPOINTS.education.list : PORTFOLIO_ENDPOINTS.education.list },
          { key: 'experience', url: authed ? DASHBOARD_ENDPOINTS.experiences.list : PORTFOLIO_ENDPOINTS.experiences.list },
          { key: 'courses', url: authed ? DASHBOARD_ENDPOINTS.courses.list : PORTFOLIO_ENDPOINTS.courses.list },
          { key: 'researches', url: authed ? DASHBOARD_ENDPOINTS.researches.list : PORTFOLIO_ENDPOINTS.researches.list },
          { key: 'achievements', url: authed ? DASHBOARD_ENDPOINTS.achievements.list : PORTFOLIO_ENDPOINTS.achievements.list },
          { key: 'blogs', url: authed ? DASHBOARD_ENDPOINTS.blogs.list : PORTFOLIO_ENDPOINTS.blogs.list },
          { key: 'media', url: authed ? DASHBOARD_ENDPOINTS.media.list : PORTFOLIO_ENDPOINTS.media.list },
          { key: 'settings', url: authed ? DASHBOARD_ENDPOINTS.settings.get : PORTFOLIO_ENDPOINTS.settings.get },
          { key: 'stats', url: DASHBOARD_ENDPOINTS.dashboard.stats },
          { key: 'positions', url: authed ? DASHBOARD_ENDPOINTS.positions.list : PORTFOLIO_ENDPOINTS.positions.list },
          { key: 'messages', url: authed ? DASHBOARD_ENDPOINTS.messages.list : null }
        ];

        const results = {};
        await Promise.all(endpoints.map(async (endpoint) => {
          try {
            const res = await apiGet(endpoint.url);
            results[endpoint.key] = res;
          } catch (err) {
            results[endpoint.key] = null;
          }
        }));

        setProfessor(results.professor?.data || results.professor || null);
        setEducation(normalizeList(results.education));
        setExperience(normalizeList(results.experience));
        setCourses(normalizeList(results.courses));
        setResearches(normalizeList(results.researches));
        setAchievements(normalizeList(results.achievements));
        setBlogs(normalizeList(results.blogs));
        setMedia(normalizeList(results.media));
        setSettings(results.settings?.data || results.settings || null);
        setStats(results.stats?.data || results.stats || null);
        setPositions(normalizeList(results.positions));
        setMessages(normalizeList(results.messages));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return null; // Or a loading spinner

  return (
    <ProfessorContext.Provider value={professor}>
      <EducationContext.Provider value={education}>
        <ExperienceContext.Provider value={experience}>
          <CoursesContext.Provider value={courses}>
            <ResearchesContext.Provider value={researches}>
              <AchievementsContext.Provider value={achievements}>
                <BlogsContext.Provider value={blogs}>
                  <MediaContext.Provider value={media}>
                    <SettingsContext.Provider value={settings}>
                      <StatsContext.Provider value={stats}>
                        <PositionsContext.Provider value={positions}>
                          <MessagesContext.Provider value={messages}>
                            {children}
                          </MessagesContext.Provider>
                        </PositionsContext.Provider>
                      </StatsContext.Provider>
                    </SettingsContext.Provider>
                  </MediaContext.Provider>
                </BlogsContext.Provider>
              </AchievementsContext.Provider>
            </ResearchesContext.Provider>
          </CoursesContext.Provider>
        </ExperienceContext.Provider>
      </EducationContext.Provider>
    </ProfessorContext.Provider>
  );
};
