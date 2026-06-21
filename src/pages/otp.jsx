import { useSearchParamsObj } from "@/lib/use-search-params-obj";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiPost } from "@/api/request";
import { DASHBOARD_ENDPOINTS } from "@/api/endpoints";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { OtpInput } from "@/components/common/OtpInput";
import { ShieldCheck, RotateCcw } from "lucide-react";
function OtpPage() {
  const nav = useNavigate();
  const { email } = useSearchParamsObj();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resend, setResend] = useState(45);
  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);
  const verify = async (otp) => {
    setBusy(true);
    try {
      const res = await apiPost(DASHBOARD_ENDPOINTS.auth.verifyOtp, {
        email,
        otp,
      });
      console.log("Verify OTP response:", res);
      toast.info("DEBUG response: " + JSON.stringify(res));
      toast.success("Code verified");
      const token = res?.data?.reset_token || res?.reset_token || res?.token || "";
      nav("/reset-password" + "?email=" + encodeURIComponent(email) + "&token=" + encodeURIComponent(token));
    } catch (e) {
      toast.error(e?.message || "Invalid code");
      setCode("");
    } finally {
      setBusy(false);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    if (code.length === 6) verify(code);
  };
  const resendCode = async () => {
    if (resend > 0) return;
    try {
      await apiPost(DASHBOARD_ENDPOINTS.auth.forgotPassword, {
        email,
      });
      toast.success("New code sent");
      setResend(45);
    } catch {
      toast.error("Could not resend");
    }
  };
  return (
    <div className="relative min-h-screen grid place-items-center px-4 bg-background">
      <CircuitBackground />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-electric/10 text-electric">
            <ShieldCheck className="size-7" />
          </div>
          <h1 className="font-display text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{email || "your email"}</span>.
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">Check the API response for the OTP code</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <OtpInput value={code} onChange={setCode} onComplete={verify} />
          <button
            disabled={busy || code.length < 6}
            className="inline-flex w-full h-11 items-center justify-center rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify code"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-electric">
            ← Change email
          </Link>
          <button
            onClick={resendCode}
            disabled={resend > 0}
            className="inline-flex items-center gap-1 text-electric disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            <RotateCcw className="size-3" />
            {resend > 0 ? `Resend in ${resend}s` : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default OtpPage;
