import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/client";
const AuthContext = createContext(null);
const KEY = "auth";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch {}
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    const { token, user } = await api.auth.login(email, password);
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
