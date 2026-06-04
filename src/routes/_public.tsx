import { Outlet, createFileRoute } from "@tanstack/react-router";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const [bootDone, setBootDone] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem("booted");
    if (seen) setBootDone(true);
    else sessionStorage.setItem("booted", "1");
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {!bootDone && <LoadingScreen onDone={() => setBootDone(true)} />}
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
