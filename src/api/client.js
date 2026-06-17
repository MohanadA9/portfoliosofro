/**
 * client.js — unified API client (Real API mode)
 *
 * All calls go through apiFetch to the Supabase Edge Function backend.
 */
import { apiFetch, setAuthToken } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP, PORTFOLIO_ENDPOINTS as PUB } from "@/api/endpoints";

// ── Endpoint map ─────────────────────────────────────────────────────────────
const EP_MAP = {
  achievements: EP.achievements,
  researches: EP.researches,
  experiences: EP.experiences,
  positions: EP.positions,
  courses: EP.courses,
  lectures: EP.lectures,
  blogs: EP.blogs,
  education: EP.education,
};

// ── Generic CRUD factory ─────────────────────────────────────────────────────
function crud(key) {
  const ep = EP_MAP[key];
  return {
    list: async (_q) => {
      const res = await apiFetch(ep.list, "GET");
      
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res && typeof res === 'object') {
        // Handle nested 'data' from apiResponce helper and Resource Collections
        const rawData = res.data;
        if (Array.isArray(rawData)) {
          data = rawData;
        } else if (rawData && typeof rawData === 'object') {
          // Check for keys like 'achievements' inside 'data'
          const possibleKey = Object.keys(rawData).find(k => Array.isArray(rawData[k]));
          data = possibleKey ? rawData[possibleKey] : [];
        } else {
          // Fallback to top-level keys
          const possibleKey = Object.keys(res).find(k => Array.isArray(res[k]) && !['links', 'meta'].includes(k));
          if (possibleKey) data = res[possibleKey];
        }
      }

      return {
        data,
        total: res?.data?.count ?? res?.count ?? data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1,
      };
    },
    get: async (id) => {
      const res = await apiFetch(ep.show(id), "GET");
      return res?.data ?? res;
    },
    create: async (payload) => {
      const res = await apiFetch(ep.store, "POST", payload);
      return res?.data ?? res;
    },
    update: async (id, payload) => {
      const res = await apiFetch(ep.update(id), "PUT", payload);
      return res?.data ?? res;
    },
    remove: async (id) => {
      const res = await apiFetch(ep.delete(id), "DELETE");
      return res?.data ?? res;
    },
  };
}

// ── Public API object ────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: async (email, password) => {
      const res = await apiFetch(EP.auth.login, "POST", { email, password });
      // Laravel often returns token in 'token', 'access_token', or 'data.token'
      const token = res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;
      if (token) setAuthToken(token);
      return { ...res, token }; // Ensure token is at top level for AuthContext
    },
    forgotPassword: (email) =>
      apiFetch(EP.auth.forgotPassword, "POST", { email }),
    verifyOtp: (email, otp) =>
      apiFetch(EP.auth.verifyOtp, "POST", { email, otp }),
    resetPassword: (token, password) =>
      apiFetch(EP.auth.resetPassword, "POST", { token, password }),
    profile: () => apiFetch(EP.user.get, "GET"),
  },

  professor: {
    get: async () => {
      const res = await apiFetch(EP.user.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(EP.user.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  about: {
    get: async () => {
      const res = await apiFetch(EP.about.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(EP.about.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  settings: {
    get: async () => {
      const res = await apiFetch(EP.settings.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(EP.settings.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  education: crud("education"),
  achievements: crud("achievements"),
  experiences: crud("experiences"),
  researches: crud("researches"),
  positions: crud("positions"),
  courses: crud("courses"),
  lectures: crud("lectures"),
  blogs: crud("blogs"),

  messages: {
    list: async (_q) => {
      const res = await apiFetch(EP.messages.list, "GET");
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      return {
        data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1,
      };
    },
    get: async (id) => {
      const res = await apiFetch(EP.messages.list + `/${id}`, "GET");
      return res?.data ?? res;
    },
    remove: (id) => apiFetch(EP.messages.delete(id), "DELETE"),
    markRead: (id) => apiFetch(EP.messages.read(id), "PATCH"),
  },

  contact: {
    send: (payload) =>
      apiFetch(PUB.contactUs.store, "POST", payload),
  },
};
