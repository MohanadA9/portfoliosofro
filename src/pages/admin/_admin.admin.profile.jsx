import { useState, useEffect, useRef } from "react";
import { Save, Camera, User, Plus, Trash2 } from "lucide-react";
import { useAdminProfessor } from "@/context/AdminDataContext";
import { api } from "@/api/client";

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
const TEXTAREA = `${INPUT} resize-none`;

const SOCIAL_KEYS = ["linkedin", "github", "scholar", "orcid", "researchgate", "twitter"];

export default function AdminProfile() {
  const professor = useAdminProfessor();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (professor) setForm(structuredClone(professor));
  }, [professor]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm((f) => ({ ...f, socials: { ...(f.socials ?? {}), [k]: v } }));

  const handleAvatar = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("avatar", r.result);
    r.readAsDataURL(file);
  };

  const setSkillField = (idx, key, val) =>
    setForm((f) => {
      const skills = [...(f.skills ?? [])];
      skills[idx] = { ...skills[idx], [key]: key === "level" ? Number(val) : val };
      return { ...f, skills };
    });

  const addSkill = () =>
    setForm((f) => ({ ...f, skills: [...(f.skills ?? []), { name: "", level: 80 }] }));

  const removeSkill = (idx) =>
    setForm((f) => ({ ...f, skills: (f.skills ?? []).filter((_, i) => i !== idx) }));

  const addInterest = () => setForm((f) => ({ ...f, interests: [...(f.interests ?? []), ""] }));

  const setInterest = (idx, val) =>
    setForm((f) => {
      const interests = [...(f.interests ?? [])];
      interests[idx] = val;
      return { ...f, interests };
    });

  const removeInterest = (idx) =>
    setForm((f) => ({ ...f, interests: (f.interests ?? []).filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.professor.update(professor?.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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

      {/* Avatar */}
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
          <Field label="Email">
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Office">
            <input
              value={form.office ?? ""}
              onChange={(e) => set("office", e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Office Hours">
            <input
              value={form.officeHours ?? ""}
              onChange={(e) => set("officeHours", e.target.value)}
              className={INPUT}
            />
          </Field>
        </div>
        <Field label="Address">
          <input
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
            className={INPUT}
          />
        </Field>
      </Section>

      {/* About */}
      <Section title="About">
        <Field label="Bio">
          <textarea
            rows={5}
            value={form.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
            className={TEXTAREA}
          />
        </Field>
        <Field label="Vision">
          <textarea
            rows={3}
            value={form.vision ?? ""}
            onChange={(e) => set("vision", e.target.value)}
            className={TEXTAREA}
          />
        </Field>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-3">
          {(form.skills ?? []).map((skill, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                value={skill.name}
                onChange={(e) => setSkillField(idx, "name", e.target.value)}
                placeholder="Skill name"
                className="w-48 shrink-0 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
              />
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={(e) => setSkillField(idx, "level", e.target.value)}
                  className="flex-1 accent-electric"
                />
                <span className="text-sm font-mono w-8 text-right text-muted-foreground">
                  {skill.level}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="grid size-7 place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-1.5 text-sm text-electric hover:opacity-80 transition mt-1"
          >
            <Plus className="size-4" /> Add skill
          </button>
        </div>
      </Section>

      {/* Interests */}
      <Section title="Research Interests">
        <div className="space-y-2">
          {(form.interests ?? []).map((interest, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={interest}
                onChange={(e) => setInterest(idx, e.target.value)}
                placeholder="e.g. Reconfigurable Intelligent Surfaces"
                className={`${INPUT} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeInterest(idx)}
                className="grid size-8 place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInterest}
            className="flex items-center gap-1.5 text-sm text-electric hover:opacity-80 transition mt-1"
          >
            <Plus className="size-4" /> New
          </button>
        </div>
      </Section>

      {/* Socials */}
      <Section title="Social Links">
        <div className="grid grid-cols-2 gap-4">
          {SOCIAL_KEYS.map((k) => (
            <Field key={k} label={k}>
              <input
                value={form.socials?.[k] ?? ""}
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
