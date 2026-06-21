import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/client";
const AuthContext = createContext(null);
const KEY = "auth";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.user || null;
      }
    } catch {}
    return null;
  });
  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.token || null;
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(false);
  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    // Extract token and user from Laravel's response structure
    const token = res.token;
    const user = res.user || res.data?.user || { email }; // Fallback to email if user object is missing
    
    setUser(user);
    setToken(token);
    localStorage.setItem(
      KEY,
      JSON.stringify({
        token,
        user,
      }),
    );
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(KEY);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
