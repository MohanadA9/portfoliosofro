/* src/api/request.js
 * Central HTTP wrapper. Flip MOCK_MODE to `false` and the entire app
 * starts hitting the real backend defined in endpoints.js.
 */
import { BASE_URL } from "./endpoints";
import professorData from "./mockData/professor.json";
import educationData from "./mockData/education.json";
import experiencesData from "./mockData/experiences.json";
import coursesData from "./mockData/courses.json";
import researchesData from "./mockData/researches.json";
import achievementsData from "./mockData/achievements.json";
import blogsData from "./mockData/blogs.json";
import mediaData from "./mockData/media.json";
import messagesData from "./mockData/messages.json";
import statsData from "./mockData/stats.json";
import positionsData from "./mockData/positions.json";
import dashboardCharts from "./mockData/dashboardCharts.json";
import siteSettings from "./mockData/settings.json";

// ============================================================
// CONFIGURATION
// ============================================================
export const MOCK_MODE = true; // ← switch to false to use real backend

// ============================================================
// MOCK DATA MAP — endpoint substring → in-memory dataset
// ============================================================
const mockDataMap = {
  "/professor": professorData,
  "/admin/professor": professorData,
  "/education": educationData,
  "/admin/education": educationData,
  "/experience": experiencesData,
  "/admin/experience": experiencesData,
  "/courses": coursesData,
  "/admin/courses": coursesData,
  "/researches": researchesData,
  "/admin/researches": researchesData,
  "/achievements": achievementsData,
  "/admin/achievements": achievementsData,
  "/blogs": blogsData,
  "/admin/blogs": blogsData,
  "/media": mediaData,
  "/admin/media": mediaData,
  "/messages": messagesData,
  "/admin/messages": messagesData,
  "/settings": siteSettings,
  "/admin/settings": siteSettings,
  "/stats": statsData,
  "/positions": positionsData,
  "/admin/positions": positionsData,
  "/dashboard/charts": dashboardCharts,
};

const simulateDelay = () => new Promise((r) => setTimeout(r, Math.random() * 400 + 250));

// ============================================================
// AUTH HELPERS
// ============================================================
const TOKEN_KEY = "auth_token";
export const getAuthToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
export const setAuthToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!getAuthToken();

// ============================================================
// REAL-API OVERRIDE LIST
// Endpoints in this array hit the real backend even when MOCK_MODE = true.
// Useful for incrementally migrating endpoints to production.
// ============================================================
const FORCE_REAL_API_ENDPOINTS = [
  // "/auth/login",
  // "/auth/forgot-password",
  // "/auth/verify-otp",
  // "/auth/reset-password",
  // "/contact-us/store",
];

// ============================================================
// MAIN apiFetch
// ============================================================
export const apiFetch = async (endpoint, method = "GET", body = null) => {
  const shouldForceReal = FORCE_REAL_API_ENDPOINTS.some((p) =>
    p instanceof RegExp ? p.test(endpoint) : endpoint.includes(p),
  );
  const useReal = !MOCK_MODE || shouldForceReal;

  // ---------- MOCK ----------
  if (!useReal) {
    await simulateDelay();

    // Auth: login
    if (endpoint.includes("/auth/login")) {
      if (body?.email && body?.password && body.password.length >= 4) {
        const token = "mock_jwt_" + Date.now();
        setAuthToken(token);
        return {
          success: true,
          token,
          user: { id: 1, name: "Admin", email: body.email, role: "admin" },
        };
      }
      throw new Error("Invalid credentials");
    }
    // Auth: forgot-password
    if (endpoint.includes("/auth/forgot-password")) {
      return { success: true, message: "OTP sent to your email", email: body?.email };
    }
    // Auth: verify-otp (accept 123456)
    if (endpoint.includes("/auth/verify-otp")) {
      if (body?.otp === "123456") return { success: true, token: "reset_token_" + Date.now() };
      throw new Error("Invalid OTP code");
    }
    // Auth: reset-password
    if (endpoint.includes("/auth/reset-password")) {
      return { success: true, message: "Password updated" };
    }
    // Contact form
    if (endpoint.includes("/contact-us/store")) {
      return { success: true, message: "Message sent" };
    }

    // GET: lookup by suffix
    if (method === "GET") {
      // longest matching key wins
      const key = Object.keys(mockDataMap)
        .filter((k) => endpoint.endsWith(k) || endpoint.includes(k + "/"))
        .sort((a, b) => b.length - a.length)[0];
      if (key) return { success: true, data: mockDataMap[key] };
      return { success: true, data: [] };
    }

    // Writes are echoed back
    return { success: true, message: "Operation successful (mock)", data: body };
  }

  // ---------- REAL ----------
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = { Accept: "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (res.status === 401) {
    if (!endpoint.includes("/auth/login")) removeAuthToken();
    const err = new Error(data?.message || "Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const apiGet = (e) => apiFetch(e, "GET");
export const apiPost = (e, b) => apiFetch(e, "POST", b);
export const apiPut = (e, b) => apiFetch(e, "PUT", b);
export const apiPatch = (e, b) => apiFetch(e, "PATCH", b);
export const apiDelete = (e) => apiFetch(e, "DELETE");
