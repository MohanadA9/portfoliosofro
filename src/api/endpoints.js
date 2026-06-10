/* src/api/endpoints.js
 * All backend endpoints in one place. Change BASE_URL once and the whole
 * app talks to the real backend (when MOCK_MODE in request.js is `false`).
 */

export const BASE_URL = "https://api.example.com/api";

// ==========================================
// Public (Portfolio) Endpoints
// ==========================================
export const PORTFOLIO_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    verifyOtp: `${BASE_URL}/auth/verify-otp`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
  },
  contactUs: { store: `${BASE_URL}/contact-us/store` },
  profile: { get: `${BASE_URL}/user/data` },
  settings: { get: `${BASE_URL}/setting` },
  achievements: { list: `${BASE_URL}/achievement`, show: (id) => `${BASE_URL}/achievement/${id}` },
  researches: { list: `${BASE_URL}/research`, show: (id) => `${BASE_URL}/research/${id}` },
  courses: { list: `${BASE_URL}/course`, show: (id) => `${BASE_URL}/course/${id}` },
  experiences: { list: `${BASE_URL}/experience` },
  positions: { list: `${BASE_URL}/position` },
  blogs: { list: `${BASE_URL}/blog`, show: (id) => `${BASE_URL}/blog/${id}` },
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
  user: { get: `${BASE_URL}/admin/user`, update: `${BASE_URL}/admin/user/update` },
  settings: {
    get: `${BASE_URL}/admin/setting`,
    update: `${BASE_URL}/admin/setting/update`,
  },
  dashboard: {
    stats: `${BASE_URL}/admin/dashboard/stats`,
    charts: `${BASE_URL}/admin/dashboard/charts`,
    activity: `${BASE_URL}/admin/dashboard/activity`,
  },
  achievements: crud("achievement"),
  researches: crud("research"),
  experiences: crud("experience"),
  positions: crud("position"),
  courses: crud("course"),
  lectures: crud("lecture"),
  blogs: crud("blog"),
  education: crud("education"),
  media: crud("media"),
  messages: {
    list: `${BASE_URL}/admin/contact-us`,
    read: (id) => `${BASE_URL}/admin/contact-us/read/${id}`,
    delete: (id) => `${BASE_URL}/admin/contact-us/delete/${id}`,
  },
};

function crud(resource) {
  return {
    list: `${BASE_URL}/admin/${resource}`,
    show: (id) => `${BASE_URL}/admin/${resource}/show/${id}`,
    store: `${BASE_URL}/admin/${resource}/store`,
    update: (id) => `${BASE_URL}/admin/${resource}/update/${id}`,
    delete: (id) => `${BASE_URL}/admin/${resource}/delete/${id}`,
  };
}
