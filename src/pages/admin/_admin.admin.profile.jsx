import { useState, useEffect, useRef } from "react";
import { Save, Camera, User, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAdminProfessor } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { apiFetch } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";

function Section({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-3.5 border-b border-border">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";

const SOCIAL_KEYS = [
  "linkedin",
  "github",
  "scholar",
  "orcid",
  "researchgate",
];

export default function AdminProfile() {
  const { data: professor } = useAdminProfessor();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    if (professor) setForm(structuredClone(professor));
  }, [professor]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) =>
    setForm((f) => ({ ...f, social_links: { ...(f.social_links ?? {}), [k]: v } }));

  const handleAvatar = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("The profile photo size must not exceed 2MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => setForm(f => ({ ...f, avatar: r.result, avatarFile: file }));
    r.readAsDataURL(file);
  };

  const handleCV = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("The CV file size must not exceed 5MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => setForm(f => ({ ...f, cv: r.result, cvFile: file }));
    r.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      // Laravel update for profile often expects POST with _method=PUT
      fd.append("_method", "PUT");

      Object.keys(form).forEach(key => {
        if (key === 'social_links') {
          Object.keys(form.social_links || {}).forEach(sk => {
            fd.append(`social_links[${sk}]`, form.social_links[sk] || "");
          });
        } else if (key === 'avatarFile') {
          fd.append('avatar', form.avatarFile);
        } else if (key === 'cvFile') {
          fd.append('cv', form.cvFile);
        } else if (['avatar', 'cv'].includes(key)) {
          // Skip the base64 previews
        } else {
          fd.append(key, form[key] ?? "");
        }
      });

      // Use raw fetch for FormData profile update
      await apiFetch(EP.user.update, "POST", fd);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your academic identity and contact info
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shrink-0"
        >
          <Save className="size-4" />
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      {/* Avatar & CV */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Profile Photo">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt=""
                  className="size-20 rounded-full object-cover border-2 border-electric/30"
                />
              ) : (
                <div className="size-20 rounded-full bg-electric/10 border-2 border-electric/20 flex items-center justify-center text-electric">
                  <User className="size-8" />
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-electric text-electric-foreground shadow-lg hover:opacity-90 transition"
              >
                <Camera className="size-3.5" />
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleAvatar(e.target.files?.[0])}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{form.name ?? "—"}</p>
              <p>{form.title ?? ""}</p>
            </div>
          </div>
        </Section>

        <Section title="Curriculum Vitae (CV)">
          <div className="flex items-center gap-4">
            <div
              onClick={() => cvRef.current?.click()}
              className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-electric/40 hover:bg-electric/5 transition cursor-pointer group"
            >
              <div className="size-10 rounded-lg bg-electric/10 flex items-center justify-center text-electric group-hover:scale-110 transition">
                <FileText className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {form.cv ? "CV Uploaded" : "Upload CV (PDF)"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {form.cv ? "Click to replace" : "Click to select file"}
                </p>
              </div>
            </div>
            <input
              ref={cvRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => handleCV(e.target.files?.[0])}
            />
            {form.cv && (
              <button
                type="button"
                onClick={() => set("cv", null)}
                className="grid size-10 place-items-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition"
                title="Remove CV"
              >
                <Trash2 className="size-5" />
              </button>
            )}
          </div>
        </Section>
      </div>

      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <input
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Title / Rank">
            <input
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department">
            <input
              value={form.department ?? ""}
              onChange={(e) => set("department", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="University">
            <input
              value={form.university ?? ""}
              onChange={(e) => set("university", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Login Email">
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Contact Email">
            <input
              type="email"
              value={form.contact_email ?? ""}
              onChange={(e) => set("contact_email", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone">
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Office">
            <input
              value={form.office ?? ""}
              onChange={(e) => set("office", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Office Hours">
            <input
              value={form.office_hours ?? ""}
              onChange={(e) => set("office_hours", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Address">
            <input
              value={form.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
      </Section>

      {/* Socials */}
      <Section title="Social Links">
        <div className="grid grid-cols-2 gap-4">
          {SOCIAL_KEYS.map((k) => (
            <Field key={k} label={k}>
              <input
                value={form.social_links?.[k] ?? ""}
                onChange={(e) => setSocial(k, e.target.value)}
                placeholder="https://…"
                className={INPUT}
              />
            </Field>
          ))}
        </div>
      </Section>
    </form>
  );
}
