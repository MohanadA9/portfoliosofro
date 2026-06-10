import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, ImageIcon, GripVertical } from "lucide-react";
import { useAdminAchievements } from "@/context/AdminDataContext";
import { api } from "@/api/client";

const INPUT =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";
const TEXTAREA = `${INPUT} resize-none`;

function Label({ children }) {
  return (
    <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ImageGrid({ images, onRemove, onAdd }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const r = new FileReader();
      r.onload = () => onAdd(r.result);
      r.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative group aspect-video rounded-lg overflow-hidden border border-border"
          >
            <img src={src} alt="" className="size-full object-cover" />
            {idx === 0 && (
              <span className="absolute top-1.5 left-1.5 text-[10px] font-mono uppercase tracking-wider bg-electric text-electric-foreground px-1.5 py-0.5 rounded">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 transition hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {/* Add slot */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/20 hover:border-electric/50 hover:bg-electric/5 transition flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-electric"
        >
          <UploadCloud className="size-5" />
          <span className="text-xs">Add images</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {images.length > 0 && (
        <p className="text-[11px] text-muted-foreground font-mono">
          First image is the cover · {images.length} image{images.length !== 1 ? "s" : ""} total
        </p>
      )}
    </div>
  );
}

const EMPTY = {
  title: "",
  description: "",
  fullDescription: "",
  date: "",
  category: "",
  liveLink: "",
  images: [],
};

export default function AchievementForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const allItems = useAdminAchievements() ?? [];
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setLoaded(true);
      return;
    }
    const item = allItems.find((a) => a.id === id);
    if (item) {
      const images = item.gallery?.length ? item.gallery : item.cover ? [item.cover] : [];
      setForm({
        title: item.title ?? "",
        description: item.description ?? item.shortDescription ?? "",
        fullDescription: item.fullDescription ?? "",
        date: item.date ?? "",
        category: item.category ?? "",
        liveLink: item.liveLink ?? "",
        images,
      });
      setLoaded(true);
    }
  }, [allItems, id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addImage = (src) => setForm((f) => ({ ...f, images: [...f.images, src] }));
  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cover = form.images[0] ?? "";
      const gallery = form.images;
      const payload = { ...form, cover, gallery };
      if (isEdit) {
        await api.achievements.update(id, payload);
      } else {
        await api.achievements.create(payload);
      }
      nav("/admin/achievements");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded)
    return (
      <div className="flex items-center justify-center py-32 text-muted-foreground">Loading…</div>
    );

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => nav("/admin/achievements")}
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">
            {isEdit ? "Edit Achievement" : "New Achievement"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
        </button>
      </div>

      {/* Images */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Images — first image becomes the cover
          </p>
        </div>
        <div className="px-6 py-5">
          <ImageGrid images={form.images} onAdd={addImage} onRemove={removeImage} />
        </div>
      </div>

      {/* Details */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Details
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={INPUT}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Award, Grant, Patent…"
                className={INPUT}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Short Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          <Field label="Full Description">
            <textarea
              rows={5}
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          <Field label="Live Link (optional)">
            <input
              type="url"
              value={form.liveLink}
              onChange={(e) => set("liveLink", e.target.value)}
              placeholder="https://…"
              className={INPUT}
            />
          </Field>
        </div>
      </div>
    </form>
  );
}
