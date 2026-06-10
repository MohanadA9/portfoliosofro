import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Radio, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@cit.edu.eg");
  const [pwd, setPwd] = useState("admin123");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, pwd);
      toast.success("Welcome back, Professor.");
      nav("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };
  const field =
    "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 glow">
        <div className="mb-6 text-center">
          <span className="inline-grid size-12 place-items-center rounded-xl bg-electric text-electric-foreground glow-sm mb-3">
            <Radio className="size-5" />
          </span>
          <h1 className="font-display text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your academic portfolio</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Password
            </span>
            <input
              required
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className={field}
            />
          </label>
          <button
            disabled={busy}
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60"
          >
            <Lock className="size-4" /> {busy ? "Signing in…" : "Sign in"}{" "}
            <ArrowRight className="size-4" />
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-electric">
            Forgot password?
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-electric">
            Back to site
          </Link>
        </div>
        <p className="mt-6 text-center text-[11px] font-mono text-muted-foreground">
          DEMO • any email + 4+ char password
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
