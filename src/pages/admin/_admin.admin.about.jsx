import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminAbout } from "@/context/AdminDataContext";
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
const TEXTAREA = `${INPUT} resize-none`;

export default function AdminAbout() {
  const { data: about } = useAdminAbout();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (about) setForm(structuredClone(about));
  }, [about]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setSkillField = (idx, key, val) =>
    setForm((f) => {
      const skills = [...(f.skills ?? [])];
      skills[idx] = {
        ...skills[idx],
        [key]: key === "level" ? Number(val) : val,
      };
      return { ...f, skills };
    });

  const addSkill = () =>
    setForm((f) => ({
      ...f,
      skills: [...(f.skills ?? []), { name: "", level: 80 }],
    }));

  const removeSkill = (idx) =>
    setForm((f) => ({
      ...f,
      skills: (f.skills ?? []).filter((_, i) => i !== idx),
    }));

  const addInterest = () =>
    setForm((f) => ({ ...f, interests: [...(f.interests ?? []), ""] }));

  const setInterest = (idx, val) =>
    setForm((f) => {
      const interests = [...(f.interests ?? [])];
      interests[idx] = val;
      return { ...f, interests };
    });

  const removeInterest = (idx) =>
    setForm((f) => ({
      ...f,
      interests: (f.interests ?? []).filter((_, i) => i !== idx),
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("bio", form.bio ?? "");
      fd.append("vision", form.vision ?? "");
      
      (form.skills ?? []).forEach((s, i) => {
        fd.append(`skills[${i}][name]`, s.name);
        fd.append(`skills[${i}][level]`, s.level);
      });

      (form.interests ?? []).forEach((interest, i) => {
        fd.append(`interests[${i}]`, interest);
      });

      await apiFetch(EP.about.update, "POST", fd);
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
          <h1 className="text-3xl font-bold font-display">About</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bio, vision, skills, and research interests
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
    </form>
  );
}
