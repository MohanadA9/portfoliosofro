import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  UploadCloud,
  FileImage,
  FileText,
  Film,
} from "lucide-react";
import { useAdminMedia } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { confirmDelete } from "@/lib/confirm";

const TYPE_ICON = { image: FileImage, video: Film, document: FileText };
const TYPES = ["image", "video", "document"];
const EMPTY = {
  name: "",
  type: "image",
  url: "",
  size: "",
  uploadedAt: new Date().toISOString().slice(0, 10),
};

function MediaModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      initial?.id ? await api.media.update(initial.id, form) : await api.media.create(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="font-semibold">{initial?.id ? "Edit Media" : "Add Media"}</p>
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded hover:bg-muted text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              File Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              URL
            </label>
            <input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://…"
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Size
              </label>
              <input
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                placeholder="1.2 MB"
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
              />
            </div>
          </div>
          {form.type === "image" && form.url && (
            <div className="rounded-lg overflow-hidden border border-border aspect-video">
              <img
                src={form.url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </form>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMedia() {
  const raw = useAdminMedia() ?? [];
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(raw);
  }, [raw]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const filtered = items.filter(
    (m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.type?.toLowerCase().includes(search.toLowerCase()),
  );
  const refresh = async () => {
    const res = await api.media.list({ pageSize: 999 });
    setItems(res.data ?? []);
  };
  const del = async (id) => {
    if (!(await confirmDelete("This media file will be permanently deleted."))) return;
    await api.media.remove(id);
    setItems((p) => p.filter((m) => m.id !== id));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Media</h1>
          <p className="text-sm text-muted-foreground mt-1">Images, documents and video files</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 transition shrink-0"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:border-electric/60"
          />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {filtered.length} items
        </span>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-16 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Size
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const Icon = TYPE_ICON[item.type] ?? FileImage;
              return (
                <tr
                  key={item.id}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    {item.type === "image" && item.url ? (
                      <img
                        src={item.url}
                        alt=""
                        className="size-10 rounded-md object-cover border border-border"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="size-10 rounded-md bg-electric/10 border border-electric/20 flex items-center justify-center text-electric">
                        <Icon className="size-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium max-w-[220px] truncate">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{item.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal(item)}
                        className="grid size-8 place-items-center rounded-md hover:bg-electric/10 text-muted-foreground hover:text-electric transition"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => del(item.id)}
                        className="grid size-8 place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No media files found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modal && (
        <MediaModal
          initial={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            refresh();
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
