/**
 * client.js — unified API client (Real API mode)
 *
 * All calls go through apiFetch to the Laravel backend.
 *
 * IMPORTANT: this file is split into two clearly separated namespaces:
 *
 *   api.public.*  → hits PORTFOLIO_ENDPOINTS (public, no auth required)
 *   api.admin.*   → hits DASHBOARD_ENDPOINTS (admin, requires Bearer token)
 *
 * The old flat shape (api.researches, api.achievements, ...) is kept as a
 * backward-compatible ALIAS to api.admin.* so existing admin-dashboard code
 * doesn't break. Public-facing pages (ResearchesPage, AchievementsPage, etc.)
 * MUST be updated to call api.public.researches, api.public.achievements, etc.
 * — that's the actual fix for the 401 Unauthenticated errors you were seeing,
 * since those pages were accidentally calling the /api/admin/* endpoints.
 */
import { apiFetch, setAuthToken } from "@/api/request";
import {
  DASHBOARD_ENDPOINTS as ADMIN_EP,
  PORTFOLIO_ENDPOINTS as PUB_EP,
} from "@/api/endpoints";

// ── Backward-compatible endpoint map ─────────────────────────────────────────
// Some components (e.g. admin form pages like admin.achievements.form.jsx)
// import EP_MAP directly from this file. Keep it exported and pointed at the
// admin (DASHBOARD_ENDPOINTS) set, since that's what it always referred to
// before this file was split into public/admin namespaces.
export const EP_MAP = {
  achievements: ADMIN_EP.achievements,
  researches: ADMIN_EP.researches,
  experiences: ADMIN_EP.experiences,
  positions: ADMIN_EP.positions,
  courses: ADMIN_EP.courses,
  lectures: ADMIN_EP.lectures,
  blogs: ADMIN_EP.blogs,
  education: ADMIN_EP.education,
};

// ── Helper: normalize a paginated/list response from apiResponce() ──────────
function normalizeList(res) {
  let data = [];

  if (res?.data && typeof res.data === "object") {
    if (Array.isArray(res.data)) {
      data = res.data;
    } else {
      const dataKey = Object.keys(res.data).find((k) =>
        Array.isArray(res.data[k])
      );
      data = dataKey ? res.data[dataKey] : [];
    }
  } else if (Array.isArray(res)) {
    data = res;
  }

  return {
    data,
    total: res?.data?.total ?? data.length,
    page: res?.data?.current_page ?? 1,
    pageSize: res?.data?.per_page ?? data.length,
    totalPages: res?.data?.last_page ?? 1,
  };
}

function buildQuery(q = {}) {
  const params = new URLSearchParams();
  Object.entries(q).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  return params.toString();
}

// ── PUBLIC CRUD factory (no auth, read-only: list/show) ─────────────────────
// PORTFOLIO_ENDPOINTS entries only expose `list` and sometimes `show`.
function publicResource(key) {
  const ep = PUB_EP[key];
  return {
    list: async (q = {}) => {
      const qs = buildQuery(q);
      const url = qs ? `${ep.list}?${qs}` : ep.list;
      const res = await apiFetch(url, "GET");
      return normalizeList(res);
    },
    get: async (id) => {
      if (!ep.show) {
        throw new Error(`No public "show" endpoint defined for "${key}"`);
      }
      const res = await apiFetch(ep.show(id), "GET");
      return res?.data ?? res;
    },
  };
}

// ── ADMIN CRUD factory (auth required, full CRUD) ────────────────────────────
function adminResource(key) {
  const ep = ADMIN_EP[key];
  return {
    list: async (q = {}) => {
      const qs = buildQuery(q);
      const url = qs ? `${ep.list}?${qs}` : ep.list;
      const res = await apiFetch(url, "GET");
      return normalizeList(res);
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

// ── PUBLIC namespace ──────────────────────────────────────────────────────
const publicApi = {
  achievements: publicResource("achievements"),
  researches: publicResource("researches"),
  courses: publicResource("courses"),
  experiences: publicResource("experiences"),
  positions: publicResource("positions"),
  blogs: publicResource("blogs"),
  education: publicResource("education"),

  about: {
    get: async () => {
      const res = await apiFetch(PUB_EP.about.get, "GET");
      return res?.data ?? res;
    },
  },

  settings: {
    get: async () => {
      const res = await apiFetch(PUB_EP.settings.get, "GET");
      return res?.data ?? res;
    },
  },

  profile: {
    get: async () => {
      const res = await apiFetch(PUB_EP.profile.get, "GET");
      return res?.data ?? res;
    },
  },

  contact: {
    send: (payload) => apiFetch(PUB_EP.contactUs.store, "POST", payload),
  },
};

// ── ADMIN namespace ────────────────────────────────────────────────────────
const adminApi = {
  auth: {
    login: async (email, password) => {
      const res = await apiFetch(ADMIN_EP.auth.login, "POST", {
        email,
        password,
      });
      // Laravel often returns token in 'token', 'access_token', or 'data.token'
      const token =
        res?.token ||
        res?.access_token ||
        res?.data?.token ||
        res?.data?.access_token;
      if (token) setAuthToken(token);
      return { ...res, token }; // Ensure token is at top level for AuthContext
    },
    logout: () => apiFetch(ADMIN_EP.auth.logout, "POST"),
    forgotPassword: (email) =>
      apiFetch(ADMIN_EP.auth.forgotPassword, "POST", { email }),
    verifyOtp: (email, otp) =>
      apiFetch(ADMIN_EP.auth.verifyOtp, "POST", { email, otp }),
    resetPassword: (token, password) =>
      apiFetch(ADMIN_EP.auth.resetPassword, "POST", { token, password }),
    profile: () => apiFetch(ADMIN_EP.user.get, "GET"),
  },

  professor: {
    get: async () => {
      const res = await apiFetch(ADMIN_EP.user.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(ADMIN_EP.user.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  about: {
    get: async () => {
      const res = await apiFetch(ADMIN_EP.about.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(ADMIN_EP.about.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  settings: {
    get: async () => {
      const res = await apiFetch(ADMIN_EP.settings.get, "GET");
      return res?.data ?? res;
    },
    update: async (payload) => {
      const res = await apiFetch(ADMIN_EP.settings.update, "POST", payload);
      return res?.data ?? res;
    },
  },

  education: adminResource("education"),
  achievements: adminResource("achievements"),
  experiences: adminResource("experiences"),
  researches: adminResource("researches"),
  positions: adminResource("positions"),
  courses: adminResource("courses"),
  lectures: adminResource("lectures"),
  blogs: {
    ...adminResource("blogs"),
    get: async (id) => {
      const res = await apiFetch(PUB_EP.blogs.show(id), "GET");
      return res?.data ?? res;
    },
  },

  messages: {
    list: async (_q) => {
      const res = await apiFetch(ADMIN_EP.messages.list, "GET");
      const rawData = res?.data?.messages ?? res?.data ?? res ?? [];
      const data = Array.isArray(rawData) ? rawData : [];
      return {
        data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1,
      };
    },
    get: async (id) => {
      const res = await apiFetch(ADMIN_EP.messages.list + `/${id}`, "GET");
      return res?.data ?? res;
    },
    remove: (id) => apiFetch(ADMIN_EP.messages.delete(id), "DELETE"),
    markRead: (id) => apiFetch(ADMIN_EP.messages.read(id), "PATCH"),
    markAllRead: () => apiFetch(ADMIN_EP.messages.readAll, "PATCH"),
  },
};

// ── Public API object ────────────────────────────────────────────────────────
export const api = {
  public: publicApi,
  admin: adminApi,

  // ── Backward-compatible aliases (point at admin namespace) ──────────────
  // Kept so existing admin-dashboard imports (api.researches, api.auth, ...)
  // keep working unchanged. New public-facing pages should call
  // api.public.* directly instead of these.
  auth: adminApi.auth,
  professor: adminApi.professor,
  about: adminApi.about,
  settings: adminApi.settings,
  education: adminApi.education,
  achievements: adminApi.achievements,
  experiences: adminApi.experiences,
  researches: adminApi.researches,
  positions: adminApi.positions,
  courses: adminApi.courses,
  lectures: adminApi.lectures,
  blogs: adminApi.blogs,
  messages: adminApi.messages,
  contact: publicApi.contact,
};