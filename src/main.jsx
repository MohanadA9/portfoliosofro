import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import App from "./App";
import "./styles.css";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <AdminDataProvider>
                <SiteSettingsProvider>
                  <App />
                  <Toaster theme="dark" position="top-right" richColors />
                </SiteSettingsProvider>
              </AdminDataProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
