import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
function AdminLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [loading, user, nav]);
  if (loading || !user) return null;
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
export default AdminLayout;
