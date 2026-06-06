declare module "@/api/request" {
  export const MOCK_MODE: boolean;
  export function getAuthToken(): string | null;
  export function setAuthToken(token: string): void;
  export function removeAuthToken(): void;
  export function isAuthenticated(): boolean;
  export function apiFetch(endpoint: string, method?: string, body?: any): Promise<any>;
  export function apiGet(endpoint: string): Promise<any>;
  export function apiPost(endpoint: string, body?: any): Promise<any>;
  export function apiPut(endpoint: string, body?: any): Promise<any>; 
  export function apiPatch(endpoint: string, body?: any): Promise<any>;
  export function apiDelete(endpoint: string): Promise<any>;
}

declare module "@/api/endpoints" {
  export const BASE_URL: string;
  type Crud = {
    list: string;
    show: (id: string | number) => string;
    store: string;
    update: (id: string | number) => string;
    delete: (id: string | number) => string;
  };
  export const PORTFOLIO_ENDPOINTS: any;
  export const DASHBOARD_ENDPOINTS: {
    auth: { login: string; logout: string; forgotPassword: string; verifyOtp: string; resetPassword: string };
    user: { get: string; update: string };
    settings: { get: string; update: string };
    dashboard: { stats: string; charts: string; activity: string };
    achievements: Crud; researches: Crud; experiences: Crud; positions: Crud;
    courses: Crud; lectures: Crud; blogs: Crud; education: Crud; media: Crud;
    messages: { list: string; read: (id: string) => string; delete: (id: string) => string };
  };
}

declare module "@/api/mockData/settings.json" {
  const value: any;
  export default value;
}
