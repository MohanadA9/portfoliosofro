/**
 * client.js — unified API client (Real API mode)
 *
 * All calls go through apiFetch to the Supabase Edge Function backend.
 */
import { MOCK_MODE, apiFetch, setAuthToken } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP, PORTFOLIO_ENDPOINTS as PUB } from "@/api/endpoints";

// ── Endpoint map ─────────────────────────────────────────────────────────────
const EP_MAP = {
  achievements: EP.achievements,
  researches: EP.researches,
  experiences: EP.experiences,
  positions: EP.positions,
  courses: EP.courses,
  blogs: EP.blogs,
  education: EP.education,
};

// ── Generic CRUD factory ─────────────────────────────────────────────────────
function crud(key) {
  const ep = EP_MAP[key];
  return {
    list: async (_q) => {
      const res = await apiFetch(ep.list, "GET");
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
    get: (id) => apiFetch(ep.show(id), "GET"),
    create: (payload) => apiFetch(ep.store, "POST", payload),
    update: (id, payload) => apiFetch(ep.update(id), "PUT", payload),
    remove: (id) => apiFetch(ep.delete(id), "DELETE"),
  };
}

// ── Public API object ────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: async (email, password) => {
      const res = await apiFetch(EP.auth.login, "POST", { email, password });
      if (res?.token) setAuthToken(res.token);
      return res;
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
    get: () => apiFetch(EP.user.get, "GET"),
    update: (payload) => apiFetch(EP.user.update, "POST", payload),
  },

  about: {
    get: () => apiFetch(EP.about.get, "GET"),
    update: (payload) => apiFetch(EP.about.update, "POST", payload),
  },

  settings: {
    get: () => apiFetch(EP.settings.get, "GET"),
    update: (payload) => apiFetch(EP.settings.update, "POST", payload),
  },

  education: crud("education"),
  achievements: crud("achievements"),
  experiences: crud("experiences"),
  researches: crud("researches"),
  positions: crud("positions"),
  courses: crud("courses"),
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
    get: (id) => apiFetch(EP.messages.list + `/${id}`, "GET"),
    remove: (id) => apiFetch(EP.messages.delete(id), "DELETE"),
    markRead: (id) => apiFetch(EP.messages.read(id), "POST"),
  },

  contact: {
    send: (payload) =>
      apiFetch(PUB.contactUs.store, "POST", payload),
  },
};
