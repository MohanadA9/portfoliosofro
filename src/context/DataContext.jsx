import { createContext, useContext } from "react";

// Load all data DIRECTLY from JSON files (truly dynamic from JSON)
import professorData from "@/data/mockData/professor.json";
import educationData from "@/data/mockData/education.json";
import experiencesData from "@/data/mockData/experiences.json";
import coursesData from "@/data/mockData/courses.json";
import researchesData from "@/data/mockData/researches.json";
import achievementsData from "@/data/mockData/achievements.json";
import blogsData from "@/data/mockData/blogs.json";
import mediaData from "@/data/mockData/media.json";
import messagesData from "@/data/mockData/messages.json";
import settingsData from "@/data/mockData/settings.json";
import statsData from "@/data/mockData/stats.json";
import positionsData from "@/data/mockData/positions.json";
import dashboardChartsData from "@/data/mockData/dashboardCharts.json";

const ProfessorContext = createContext(null);
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
                            <DashboardChartsContext.Provider value={dashboardChartsData}>
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
    </ProfessorContext.Provider>
  );
};
