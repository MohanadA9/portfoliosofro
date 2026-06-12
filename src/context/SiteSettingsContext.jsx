import { createContext, useContext, useEffect, useState } from "react";
import seedSettings from "@/api/mockData/settings.json";

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx)
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(seedSettings);

  useEffect(() => {
    const href = settings?.favicon;
    if (!href) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [settings?.favicon]);

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
