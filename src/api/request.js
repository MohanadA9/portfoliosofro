/* src/api/request.js
 * Central HTTP wrapper. Handles authentication and API requests.
 */
import { BASE_URL } from "./endpoints";

// ============================================================
// CONFIGURATION
// ============================================================
export const MOCK_MODE = false;

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
  
  // Construct full URL
  if (!endpoint.startsWith("http")) {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    // If BASE_URL is just "/api" (for proxy), we ensure we don't double it
    if (BASE_URL === "/api" && cleanEndpoint.startsWith("/api")) {
      fullUrl = cleanEndpoint;
    } else {
      fullUrl = `${BASE_URL}${cleanEndpoint}`;
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
  
  let actualMethod = method;
  if (body instanceof FormData && (method === "PUT" || method === "PATCH")) {
    body.append("_method", method);
    actualMethod = "POST";
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(fullUrl, {
      method: actualMethod,
      headers,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
    });

    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();

    if (res.status === 401) {
      // ONLY remove token if we are NOT on the login page or trying to login
      const isLoginRequest = endpoint.includes("/auth/login") || window.location.pathname.includes("/login");
      if (!isLoginRequest) {
        removeAuthToken();
        localStorage.removeItem("auth");
        
        // Force redirect to login if we are inside the admin panel
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/login";
        }
      }
      
      const err = new Error(data?.message || "Unauthorized");
      err.status = 401;
      err.data = data;
      throw err;
    }

    if (!res.ok) {
      const err = new Error(data?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${fullUrl}:`, error);
    throw error;
  }
};

export const apiGet = (e) => apiFetch(e, "GET");
export const apiPost = (e, b) => apiFetch(e, "POST", b);
export const apiPut = (e, b) => apiFetch(e, "PUT", b);
export const apiPatch = (e, b) => apiFetch(e, "PATCH", b);
export const apiDelete = (e) => apiFetch(e, "DELETE");
