import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/api/client";

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx)
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.settings
      .get()
      .then((res) => {
        if (!active) return;
        const data = res?.data ?? res;
        if (data) setSettings(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const updateSettings = useCallback(async (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    try {
      await api.settings.update(patch);
    } catch {
      // Optimistic — will reconcile on next load
    }
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
