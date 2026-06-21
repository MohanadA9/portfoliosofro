/* src/api/endpoints.js
 * All backend endpoints in one place. Change BASE_URL once and the whole
 * app talks to the real backend (when MOCK_MODE in request.js is `false`).
 */

// Update this to your actual Laravel backend URL
// For local development: http://localhost:8000/api
// For production: https://your-domain.com/api
// Using relative path to trigger Vite Proxy and bypass CORS
// If you are NOT using Vite Proxy, change this to your full backend URL (e.g., "http://localhost:8000/api")
export const BASE_URL = "https://portfolioso.test/api";

// ==========================================
// Public (Portfolio) Endpoints
// ==========================================
// NOTE: these must match routes/api.php exactly.
// Public "show" routes use the pattern: /{resource}/show/{id}
// (same pattern as the admin routes, just without the /admin prefix and
// without auth:sanctum middleware).
export const PORTFOLIO_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    verifyOtp: `${BASE_URL}/auth/verify-otp`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
  },
  contactUs: { store: `${BASE_URL}/contact-us/store` },
  profile: { get: `${BASE_URL}/user/data` },
  about: { get: `${BASE_URL}/about` },
  settings: { get: `${BASE_URL}/setting` },
  achievements: {
    list: `${BASE_URL}/achievement`,
    show: (id) => `${BASE_URL}/achievement/show/${id}`,
  },
  researches: {
    list: `${BASE_URL}/research`,
    show: (id) => `${BASE_URL}/research/show/${id}`,
  },
  courses: {
    list: `${BASE_URL}/course`,
    show: (id) => `${BASE_URL}/course/show/${id}`,
  },
  lectures: {
    list: `${BASE_URL}/lecture`,
    show: (id) => `${BASE_URL}/lecture/show/${id}`,
  },
  // NOTE: experience, position, and education have NO public "show" route
  // in routes/api.php (no /experience/show/{id} etc. defined). Only `index`
  // (list) is public for these. If you need a detail page for these later,
  // add a matching `show` route in Laravel first.
  experiences: { list: `${BASE_URL}/experience` },
  positions: { list: `${BASE_URL}/position` },
  blogs: {
    list: `${BASE_URL}/blog`,
    show: (id) => `${BASE_URL}/blog/show/${id}`,
  },
  education: { list: `${BASE_URL}/education` },
};

// ==========================================
// Admin (Dashboard) Endpoints
// ==========================================
export const DASHBOARD_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/admin/auth/logout`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    verifyOtp: `${BASE_URL}/auth/verify-otp`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
  },
  user: {
    get: `${BASE_URL}/admin/user`,
    update: `${BASE_URL}/admin/user/update`,
  },
  about: {
    get: `${BASE_URL}/admin/about`,
    update: `${BASE_URL}/admin/about/update`,
  },
  settings: {
    get: `${BASE_URL}/admin/setting`,
    update: `${BASE_URL}/admin/setting/update`,
  },
  achievements: crud("achievement"),
  researches: crud("research"),
  experiences: crudNoShow("experience"),
  positions: crudNoShow("position"),
  courses: crud("course"),
  lectures: crud("lecture"),
  blogs: crudNoShow("blog"),
  education: crudNoShow("education"),
  messages: {
    list: `${BASE_URL}/admin/contact-us`,
    readAll: `${BASE_URL}/admin/contact-us/read-all`,
    read: (id) => `${BASE_URL}/admin/contact-us/read/${id}`,
    delete: (id) => `${BASE_URL}/admin/contact-us/delete/${id}`,
  },
};

// Full CRUD: index/store/show/update/delete (matches resources that have
// a `show` route defined in the admin group: achievement, research, course,
// lecture).
function crud(resource) {
  return {
    list: `${BASE_URL}/admin/${resource}`,
    show: (id) => `${BASE_URL}/admin/${resource}/show/${id}`,
    store: `${BASE_URL}/admin/${resource}/store`,
    update: (id) => `${BASE_URL}/admin/${resource}/update/${id}`,
    delete: (id) => `${BASE_URL}/admin/${resource}/delete/${id}`,
  };
}

// CRUD without a `show` route (matches resources that only have
// index/store/update/delete in the admin group: experience, position,
// blog, education — no `show` route defined in routes/api.php).
function crudNoShow(resource) {
  return {
    list: `${BASE_URL}/admin/${resource}`,
    store: `${BASE_URL}/admin/${resource}/store`,
    update: (id) => `${BASE_URL}/admin/${resource}/update/${id}`,
    delete: (id) => `${BASE_URL}/admin/${resource}/delete/${id}`,
  };
}