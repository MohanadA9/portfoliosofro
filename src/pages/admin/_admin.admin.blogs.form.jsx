import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, Image as ImageIcon, X, Loader as Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { useAdminBlogs } from "@/context/AdminDataContext";

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

function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  useEffect(() => {
    return () => {
      if (value instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value, previewUrl]);

  const handleFiles = (files) => {
    if (files?.[0]) {
      onChange(files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative rounded-lg border-2 border-dashed transition overflow-hidden cursor-pointer ${
        drag ? "border-electric bg-electric/5" : "border-border bg-muted/20 hover:border-electric/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {previewUrl ? (
        <div className="relative aspect-video">
          <img src={previewUrl} className="w-full h-full object-cover" alt="Cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-lg bg-black/60 text-white hover:text-destructive transition"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4"
        >
          <div className="grid size-14 place-items-center rounded-full bg-electric/10 text-electric">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-base font-medium">Drag & drop or click to browse</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <ImageIcon className="size-4" /> PNG · JPG · WEBP
          </p>
        </div>
      )}
    </div>
  );
}

const EMPTY = { title: "", excerpt: "", content: "", cover: "", date: "", category: "", slug: "" };

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reload } = useAdminBlogs();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setLoadError(null);
      api.blogs
        .get(id)
        .then((data) => {
          setForm({ ...EMPTY, ...(data ?? {}) });
          setLoading(false);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("Failed to load blog post:", err);
          setLoading(false);
          setLoadError(
            err?.message ||
              "Failed to load this post. It may not exist, or the server returned an error.",
          );
        });
    }
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title ?? "");
      fd.append("excerpt", form.excerpt ?? "");
      fd.append("content", form.content ?? "");
      fd.append("category", form.category ?? "");
      if (form.date) fd.append("date", form.date);

      // Only attach cover if the user picked a NEW file. If it's still a
      // string (existing URL) or empty, don't send it — the backend keeps
      // whatever cover is already saved.
      if (form.cover instanceof File) {
        fd.append("cover", form.cover);
      }

      if (isEdit) {
        await api.blogs.update(id, fd);
      } else {
        await api.blogs.create(fd);
      }
      if (typeof reload === "function") {
        await reload();
      }
      navigate("/admin/blogs");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save blog post:", err);
      const serverMsg =
        err?.data?.message ||
        (err?.data?.errors ? Object.values(err.data.errors).flat().join(" ") : null);
      alert(serverMsg || err?.message || "Failed to save. Please check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 text-electric animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> Back to Blogs
        </button>
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/blogs")}
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Cover Image
          </p>
        </div>
        <div className="px-6 py-5">
          <ImageUpload value={form.cover} onChange={(v) => set("cover", v ?? "")} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-3.5 border-b border-border">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Title & Excerpt
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Enter post title..."
                className={INPUT}
              />
            </Field>

            <Field label="Excerpt">
              <textarea
                rows={3}
                required
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Brief description for the post..."
                className={TEXTAREA}
              />
            </Field>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-3.5 border-b border-border">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Metadata
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <Field label="Category">
              <input
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Technology, Research..."
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
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Content (Markdown)
          </p>
        </div>
        <div className="px-6 py-5">
          <Field label="">
            <textarea
              rows={16}
              required
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your post content here using markdown..."
              className={`${TEXTAREA} font-mono leading-relaxed`}
            />
          </Field>
        </div>
      </div>
    </form>
  );
}