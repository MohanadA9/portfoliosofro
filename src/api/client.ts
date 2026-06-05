/**
 * Mock API client — simulates a real HTTP layer with latency, errors,
 * pagination, search, sort, and CRUD. Built on top of an in-memory store
 * seeded from src/data/mockData.ts so screens behave as if a backend exists.
 */
import {
  achievements as seedAchievements,
  experiences as seedExperiences,
  researches as seedResearches,
  positions as seedPositions,
  courses as seedCourses,
  blogs as seedBlogs,
  messages as seedMessages,
  media as seedMedia,
  professor as seedProfessor,
  education as seedEducation,
  dashboardCharts,
  stats,
} from "@/data/mockData";
import seedSettings from "./mockData/settings.json";

const LATENCY = 350;
const delay = <T,>(data: T, ms = LATENCY): Promise<T> =>
  new Promise((res) => setTimeout(() => res(structuredClone(data)), ms));

type Store = {
  professor: typeof seedProfessor;
  settings: typeof seedSettings;
  education: typeof seedEducation;
  achievements: typeof seedAchievements;
  experiences: typeof seedExperiences;
  researches: typeof seedResearches;
  positions: typeof seedPositions;
  courses: typeof seedCourses;
  blogs: typeof seedBlogs;
  messages: typeof seedMessages;
  media: typeof seedMedia;
};

const store: Store = {
  professor: structuredClone(seedProfessor),
  settings: structuredClone(seedSettings),
  education: structuredClone(seedEducation) as any,
  achievements: structuredClone(seedAchievements),
  experiences: structuredClone(seedExperiences),
  researches: structuredClone(seedResearches),
  positions: structuredClone(seedPositions),
  courses: structuredClone(seedCourses),
  blogs: structuredClone(seedBlogs),
  messages: structuredClone(seedMessages),
  media: structuredClone(seedMedia),
};

export type ListQuery = {
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  filter?: Record<string, string | undefined>;
};

function paginate<T extends Record<string, any>>(items: T[], q: ListQuery = {}) {
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
      const av = a[q.sortBy!]; const bv = b[q.sortBy!];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (q.sortDir === "desc" ? -1 : 1);
    });
  }
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const total = out.length;
  const data = out.slice((page - 1) * pageSize, page * pageSize);
  return { data, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function crud<K extends keyof Store>(key: K) {
  type T = Store[K] extends Array<infer U> ? U : never;
  return {
    list: (q?: ListQuery) => delay(paginate(store[key] as any[], q)),
    get: async (itemId: string) => {
      const found = (store[key] as any[]).find((x) => x.id === itemId);
      if (!found) throw new Error("Not found");
      return delay(found as T);
    },
    create: async (payload: Partial<T>) => {
      const item = { ...payload, id: id(String(key).slice(0, 3)) } as T;
      (store[key] as any[]).unshift(item);
      return delay(item);
    },
    update: async (itemId: string, payload: Partial<T>) => {
      const arr = store[key] as any[];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      arr[idx] = { ...arr[idx], ...payload };
      return delay(arr[idx] as T);
    },
    remove: async (itemId: string) => {
      const arr = store[key] as any[];
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx === -1) throw new Error("Not found");
      const [removed] = arr.splice(idx, 1);
      return delay(removed as T);
    },
  };
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(null, 600);
      if (email && password.length >= 4) {
        const token = btoa(`${email}:${Date.now()}`);
        return { token, user: { id: "u-1", name: "Karim Mansour", email, role: "admin" as const } };
      }
      throw new Error("Invalid credentials");
    },
    forgotPassword: (email: string) => delay({ ok: true, email }, 500),
    resetPassword: (_token: string, _password: string) => delay({ ok: true }, 500),
    profile: () => delay(store.professor),
  },
  professor: {
    get: () => delay(store.professor),
    update: async (payload: Partial<typeof store.professor>) => {
      store.professor = { ...store.professor, ...payload };
      return delay(store.professor);
    },
  settings: {
    get: () => delay(store.settings),
    update: async (payload: Partial<typeof store.settings>) => {
      store.settings = { ...store.settings, ...payload };
      return delay(store.settings);
    },
  },
  education: crud("education"),
  achievements: crud("achievements"),
  experiences: crud("experiences"),
  researches: crud("researches"),
  positions: crud("positions"),
  courses: crud("courses"),
  blogs: crud("blogs"),
  messages: {
    ...crud("messages"),
    markRead: async (mid: string, read: boolean) => {
      const m = store.messages.find((x) => x.id === mid);
      if (m) m.read = read;
      return delay(m);
    },
  },
  media: crud("media"),
  contact: {
    send: async (payload: { name: string; email: string; subject: string; body: string }) => {
      store.messages.unshift({ ...payload, id: id("msg"), date: new Date().toISOString().slice(0, 10), read: false });
      return delay({ ok: true });
    },
  },
  dashboard: {
    stats: () =>
      delay({
        ...stats,
        totalAchievements: store.achievements.length,
        totalResearches: store.researches.length,
        totalCourses: store.courses.length,
        totalLectures: store.courses.reduce((n, c) => n + c.lectures.length, 0),
        totalBlogs: store.blogs.length,
        totalMessages: store.messages.length,
        unreadMessages: store.messages.filter((m) => !m.read).length,
      }),
    charts: () => delay(dashboardCharts),
    recentActivities: () => delay(dashboardCharts.recentActivities),
  },
};

export type Api = typeof api;
