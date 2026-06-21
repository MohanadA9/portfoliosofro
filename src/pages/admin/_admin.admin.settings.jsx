import { useState, useEffect, useRef } from "react";
import { Save, Image as ImageIcon, Upload } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { api } from "@/api/client";
import { apiFetch } from "@/api/request";
import { DASHBOARD_ENDPOINTS as EP } from "@/api/endpoints";
import { toast } from "sonner";

const INPUT =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";

function ImageDropField({ label, value, onChange, contain }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result, file);
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
  const [form, setForm] = useState({ doctor_name: "", icon: "", favicon: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings)
      setForm({
        doctor_name: settings.doctor_name ?? "",
        icon: settings.icon ?? "",
        favicon: settings.favicon ?? "",
      });
  }, [settings]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("doctor_name", form.doctor_name);
      if (form.iconFile) fd.append("icon", form.iconFile);
      if (form.faviconFile) fd.append("favicon", form.faviconFile);

      await apiFetch(EP.settings.update, "POST", fd);
      updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err?.message || "Operation failed");
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
            value={form.doctor_name}
            onChange={(e) => set("doctor_name", e.target.value)}
            placeholder="e.g. Dr. Mohamed Sobhy Elbakry"
            className={INPUT}
          />
        </div>

        <ImageDropField
          label="Icon"
          value={form.icon}
          onChange={(preview, file) => {
            setForm(f => ({ ...f, icon: preview, iconFile: file }));
          }}
        />

        <ImageDropField
          label="Favicon"
          value={form.favicon}
          onChange={(preview, file) => {
            setForm(f => ({ ...f, favicon: preview, faviconFile: file }));
          }}
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

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your site identity
        </p>
      </div>

      <SiteIdentityCard />
    </div>
  );
}
