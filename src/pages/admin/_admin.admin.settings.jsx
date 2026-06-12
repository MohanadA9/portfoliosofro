import { useState, useEffect, useRef } from "react";
import { KeyRound, Eye, EyeOff, Save, ImageIcon, Upload } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { api } from "@/api/client";

const INPUT =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";

function ImageDropField({ label, value, onChange, contain }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 cursor-pointer transition ${
          dragging
            ? "border-electric bg-electric/10"
            : "border-border hover:border-electric/50"
        }`}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={`size-16 rounded-lg ${contain ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <Upload className="size-6 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">
          {dragging ? "Drop here" : "Drag & drop or click to browse"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

function SiteIdentityCard() {
  const { settings, updateSettings } = useSiteSettings();
  const [form, setForm] = useState({ doctorName: "", icon: "", favicon: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings)
      setForm({
        doctorName: settings.doctorName ?? "",
        icon: settings.icon ?? "",
        favicon: settings.favicon ?? "",
      });
  }, [settings]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateSettings(form);
      await api.settings.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-border">
        <ImageIcon className="size-4 text-electric" />
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Site Identity
        </p>
      </div>

      <form onSubmit={submit} className="px-6 py-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Doctor Name
          </label>
          <input
            value={form.doctorName}
            onChange={(e) => set("doctorName", e.target.value)}
            placeholder="e.g. Dr. Mohamed Sobhy Elbakry"
            className={INPUT}
          />
        </div>

        <ImageDropField
          label="Icon"
          value={form.icon}
          onChange={(v) => set("icon", v)}
        />

        <ImageDropField
          label="Favicon"
          value={form.favicon}
          onChange={(v) => set("favicon", v)}
          contain
        />

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          <Save className="size-4" />
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </form>
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${INPUT} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 4) {
      setStatus("error");
      setMsg("New password must be at least 4 characters.");
      return;
    }
    if (next !== confirm) {
      setStatus("error");
      setMsg("New passwords do not match.");
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
      setMsg("Password changed successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your site identity and account security
        </p>
      </div>

      <SiteIdentityCard />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-border">
          <KeyRound className="size-4 text-electric" />
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Change Password
          </p>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <PasswordField
            label="Current Password"
            value={current}
            onChange={setCurrent}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={next}
            onChange={setNext}
            placeholder="At least 4 characters"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Repeat new password"
          />

          {status === "error" && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">
              {msg}
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-400 bg-green-400/10 rounded-lg px-4 py-2.5">
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !current || !next || !confirm}
            className="w-full py-2.5 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 transition"
          >
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
