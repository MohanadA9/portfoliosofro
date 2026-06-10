import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { apiPost } from "@/api/request";
import { DASHBOARD_ENDPOINTS } from "@/api/endpoints";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { Mail, ArrowRight } from "lucide-react";
function ForgotPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiPost(DASHBOARD_ENDPOINTS.auth.forgotPassword, {
        email,
      });
      toast.success("Verification code sent to your email");
      nav("/otp" + "?email=" + encodeURIComponent(email));
    } catch (err) {
      toast.error(err?.message || "Could not send code");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-6">
          <div className="mb-3 grid size-12 place-items-center rounded-xl bg-electric/10 text-electric">
            <Mail className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we'll send a 6-digit verification code.
          </p>
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
              className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
            />
          </label>
          <button
            disabled={busy}
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? (
              "Sending…"
            ) : (
              <>
                Send code <ArrowRight className="size-4" />
              </>
            )}
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
export default ForgotPage;
