import { createContext, useContext } from "react";

// Load all data DIRECTLY from JSON files in the api/mockData folder
import professorData from "@/api/mockData/professor.json";
import aboutData from "@/api/mockData/about.json";
import educationData from "@/api/mockData/education.json";
import experiencesData from "@/api/mockData/experiences.json";
import coursesData from "@/api/mockData/courses.json";
import researchesData from "@/api/mockData/researches.json";
import achievementsData from "@/api/mockData/achievements.json";
import blogsData from "@/api/mockData/blogs.json";
import mediaData from "@/api/mockData/media.json";
import messagesData from "@/api/mockData/messages.json";
import settingsData from "@/api/mockData/settings.json";
import statsData from "@/api/mockData/stats.json";
import positionsData from "@/api/mockData/positions.json";
import dashboardChartsData from "@/api/mockData/dashboardCharts.json";

const ProfessorContext = createContext(null);
const AboutContext = createContext(null);
const EducationContext = createContext([]);
const ExperienceContext = createContext([]);
const CoursesContext = createContext([]);
const ResearchesContext = createContext([]);
const AchievementsContext = createContext([]);
const BlogsContext = createContext([]);
const MediaContext = createContext([]);
const MessagesContext = createContext([]);
const SettingsContext = createContext(null);
const StatsContext = createContext(null);
const PositionsContext = createContext([]);
const DashboardChartsContext = createContext(null);

export const useProfessor = () => useContext(ProfessorContext);
export const useAbout = () => useContext(AboutContext);
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
export const useDashboardCharts = () => useContext(DashboardChartsContext);

export const DataProvider = ({ children }) => {
  return (
    <ProfessorContext.Provider value={professorData}>
      <AboutContext.Provider value={aboutData}>
        <EducationContext.Provider value={educationData}>
          <ExperienceContext.Provider value={experiencesData}>
            <CoursesContext.Provider value={coursesData}>
              <ResearchesContext.Provider value={researchesData}>
                <AchievementsContext.Provider value={achievementsData}>
                  <BlogsContext.Provider value={blogsData}>
                    <MediaContext.Provider value={mediaData}>
                      <SettingsContext.Provider value={settingsData}>
                        <StatsContext.Provider value={statsData}>
                          <PositionsContext.Provider value={positionsData}>
                            <MessagesContext.Provider value={messagesData}>
                              <DashboardChartsContext.Provider
                                value={dashboardChartsData}
                              >
                                {children}
                              </DashboardChartsContext.Provider>
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
      </AboutContext.Provider>
    </ProfessorContext.Provider>
  );
};
