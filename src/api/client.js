/**
 * client.js — unified API client
 *
 *  MOCK_MODE = true  → in-memory store seeded from JSON (no network calls)
 *  MOCK_MODE = false → calls real backend via apiFetch / DASHBOARD_ENDPOINTS
 */
import seedProfessor from "./mockData/professor.json";
import seedEducation from "./mockData/education.json";
import seedExperiences from "./mockData/experiences.json";
import seedCourses from "./mockData/courses.json";
import seedResearches from "./mockData/researches.json";
import seedAchievements from "./mockData/achievements.json";
import seedBlogs from "./mockData/blogs.json";
import seedMedia from "./mockData/media.json";
import seedMessages from "./mockData/messages.json";
import seedPositions from "./mockData/positions.json";
import seedStats from "./mockData/stats.json";
import seedDashboardCharts from "./mockData/dashboardCharts.json";
import seedSettings from "./mockData/settings.json";

import { MOCK_MODE, apiFetch, setAuthToken } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";

// ── Helpers (mock only) ───────────────────────────────────────────────────────
const LATENCY = 350;
const delay = (data, ms = LATENCY) =>
  new Promise((res) => setTimeout(() => res(structuredClone(data)), ms));

// In-memory store — only used when MOCK_MODE = true
const store = {
  professor: structuredClone(seedProfessor),
  settings: structuredClone(seedSettings),
  education: structuredClone(seedEducation),
  achievements: structuredClone(seedAchievements),
  experiences: structuredClone(seedExperiences),
  researches: structuredClone(seedResearches),
  positions: structuredClone(seedPositions),
  courses: structuredClone(seedCourses),
  blogs: structuredClone(seedBlogs),
  messages: structuredClone(seedMessages),
  media: structuredClone(seedMedia),
};

function paginate(items, q = {}) {
  let out = [...items];
  if (q.search) {
    const s = q.search.toLowerCase();
    out = out.filter((it) =>
      Object.values(it).some((v) => typeof v === "string" && v.toLowerCase().includes(s)),
    );
  }
  if (q.filter) {
    for (const [k, v] of Object.entries(q.filter)) {
      if (v) out = out.filter((it) => String(it[k]) === v);
    }
  }
  if (q.sortBy) {
    out.sort((a, b) => {
      const av = a[q.sortBy],
        bv = b[q.sortBy];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (q.sortDir === "desc" ? -1 : 1);
    });
  }
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const total = out.length;
  return {
    data: out.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ── Endpoint map for real API ────────────────────────────────────────────────
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
  if (!MOCK_MODE) {
    const ep = EP_MAP[key];
    return {
      list: async (_q) => {
        const res = await apiFetch(ep.list, "GET");
        const data = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 };
      },
      get: (id) => apiFetch(ep.show(id), "GET"),
      create: (payload) => apiFetch(ep.store, "POST", payload),
      update: (id, payload) => apiFetch(ep.update(id), "PUT", payload),
      remove: (id) => apiFetch(ep.delete(id), "DELETE"),
    };
  }

  // ── Mock implementation ──
  return {
    list: (q) => delay(paginate(store[key], q)),
    get: async (itemId) => {
      const found = store[key].find((x) => x.id === itemId);
      if (!found) throw new Error("Not found");
      return delay(found);
    },
    create: async (payload) => {
      const item = { ...payload, id: uid(String(key).slice(0, 3)) };
      store[key].unshift(item);
      return delay(item);
    },
    update: async (itemId, payload) => {
      const arr = store[key];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      arr[idx] = { ...arr[idx], ...payload };
      return delay(arr[idx]);
    },
    remove: async (itemId) => {
      const arr = store[key];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      const [removed] = arr.splice(idx, 1);
      return delay(removed);
    },
  };
}

// ── Public API object ────────────────────────────────────────────────────────
export const api = {
  auth: MOCK_MODE
    ? {
        login: async (email, password) => {
          await delay(null, 600);
          if (email && password.length >= 4) {
            const token = btoa(`${email}:${Date.now()}`);
            return { token, user: { id: "u-1", name: "Karim Mansour", email, role: "admin" } };
          }
          throw new Error("Invalid credentials");
        },
        forgotPassword: (email) => delay({ ok: true, email }, 500),
        resetPassword: (_token, _password) => delay({ ok: true }, 500),
        profile: () => delay(store.professor),
      }
    : {
        login: async (email, password) => {
          const res = await apiFetch(EP.auth.login, "POST", { email, password });
          if (res?.token) setAuthToken(res.token);
          return res;
        },
        forgotPassword: (email) => apiFetch(EP.auth.forgotPassword, "POST", { email }),
        resetPassword: (token, password) =>
          apiFetch(EP.auth.resetPassword, "POST", { token, password }),
        profile: () => apiFetch(EP.user.get, "GET"),
      },

  professor: MOCK_MODE
    ? {
        get: () => delay(store.professor),
        update: async (payload) => {
          store.professor = { ...store.professor, ...payload };
          return delay(store.professor);
        },
      }
    : {
        get: () => apiFetch(EP.user.get, "GET"),
        update: (payload) => apiFetch(EP.user.update, "POST", payload),
      },

  settings: MOCK_MODE
    ? {
        get: () => delay(store.settings),
        update: async (payload) => {
          store.settings = { ...store.settings, ...payload };
          return delay(store.settings);
        },
      }
    : {
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

  messages: MOCK_MODE
    ? {
        ...crud("messages"),
        markRead: async (mid) => {
          const m = store.messages.find((x) => x.id === mid);
          if (m) m.read = true;
          return delay(m);
        },
      }
    : {
        list: async (_q) => {
          const res = await apiFetch(EP.messages.list, "GET");
          const data = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 };
        },
        get: (id) => apiFetch(EP.messages.list + `/${id}`, "GET"),
        remove: (id) => apiFetch(EP.messages.delete(id), "DELETE"),
        markRead: (id) => apiFetch(EP.messages.read(id), "POST"),
      },

  media: crud("media"),

  contact: MOCK_MODE
    ? {
        send: async (payload) => {
          store.messages.unshift({
            ...payload,
            id: uid("msg"),
            date: new Date().toISOString().slice(0, 10),
            read: false,
          });
          return delay({ ok: true });
        },
      }
    : {
        send: (payload) => apiFetch(EP.contactUs?.store ?? "/contact-us/store", "POST", payload),
      },

  dashboard: MOCK_MODE
    ? {
        stats: () =>
          delay({
            ...seedStats,
            totalAchievements: store.achievements.length,
            totalResearches: store.researches.length,
            totalCourses: store.courses.length,
            totalLectures: store.courses.reduce((n, c) => n + c.lectures.length, 0),
            totalBlogs: store.blogs.length,
            totalMessages: store.messages.length,
            unreadMessages: store.messages.filter((m) => !m.read).length,
          }),
        charts: () => delay(seedDashboardCharts),
        recentActivities: () => delay(seedDashboardCharts.recentActivities),
      }
    : {
        stats: () => apiFetch(EP.dashboard.stats, "GET"),
        charts: () => apiFetch(EP.dashboard.charts, "GET"),
        recentActivities: () => apiFetch(EP.dashboard.activity, "GET"),
      },
};
