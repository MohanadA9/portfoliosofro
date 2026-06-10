import { useSearchParamsObj } from "@/lib/use-search-params-obj";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { apiPost } from "@/api/request";
import { DASHBOARD_ENDPOINTS } from "@/api/endpoints";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { Eye, EyeOff, KeyRound } from "lucide-react";
function strengthOf(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0..4
}
function ResetPage() {
  const nav = useNavigate();
  const { email } = useSearchParamsObj();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const score = useMemo(() => strengthOf(pwd), [pwd]);
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const colors = [
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-electric",
  ];
  const submit = async (e) => {
    e.preventDefault();
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (pwd !== confirm) return toast.error("Passwords don't match");
    setBusy(true);
    try {
      await apiPost(DASHBOARD_ENDPOINTS.auth.resetPassword, {
        email,
        password: pwd,
      });
      toast.success("Password updated. Please sign in.");
      nav("/login");
    } catch (err) {
      toast.error(err?.message || "Could not update password");
    } finally {
      setBusy(false);
    }
  };
  const field =
    "w-full rounded-md border border-input bg-card px-3 py-2.5 pr-10 text-sm focus:border-electric focus:outline-none";
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-6">
          <div className="mb-3 grid size-12 place-items-center rounded-xl bg-electric/10 text-electric">
            <KeyRound className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a new password for {email || "your account"}.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                New password
              </span>
              <div className="relative">
                <input
                  required
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className={field}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-md hover:bg-muted text-muted-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            {pwd && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i < score ? colors[score - 1] : "bg-muted"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  {labels[score]}
                </p>
              </div>
            )}
          </div>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Confirm password
            </span>
            <div className="relative">
              <input
                required
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={field}
              />
            </div>
          </label>
          <button
            disabled={busy}
            className="inline-flex w-full h-11 items-center justify-center rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
        <Link
          to="/login"
          className="mt-4 inline-block text-xs text-muted-foreground hover:text-electric"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
export default ResetPage;
