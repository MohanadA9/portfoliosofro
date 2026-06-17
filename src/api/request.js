/* src/api/request.js
 * Central HTTP wrapper. MOCK_MODE = false — the entire app
 * hits the real backend defined in endpoints.js.
 */
import { BASE_URL } from "./endpoints";

// ============================================================
// CONFIGURATION
// ============================================================
export const MOCK_MODE = false; // Real API mode

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
// MAIN apiFetch
// ============================================================
export const apiFetch = async (endpoint, method = "GET", body = null) => {
  let fullUrl = endpoint;
  if (!endpoint.startsWith("http")) {
    // If endpoint already starts with BASE_URL, don't prepend it
    if (BASE_URL !== "/" && endpoint.startsWith(BASE_URL)) {
      fullUrl = endpoint;
    } else {
      fullUrl = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    }
  }
  const headers = { 
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    credentials: "omit", // Using Bearer token, so we don't need cookies
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();

  if (res.status === 401) {
    if (!endpoint.includes("/auth/login")) removeAuthToken();
    const err = new Error(data?.message || "Unauthorized — please log in again");
    err.status = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }

  if (res.status === 403) {
    const err = new Error(data?.message || "Forbidden — you do not have access");
    err.status = 403;
    err.code = "FORBIDDEN";
    throw err;
  }

  if (res.status === 404) {
    const err = new Error(data?.message || "Resource not found");
    err.status = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  if (res.status === 422) {
    const err = new Error(data?.message || "Validation error");
    err.status = 422;
    err.code = "VALIDATION_ERROR";
    err.data = data;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = "SERVER_ERROR";
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
