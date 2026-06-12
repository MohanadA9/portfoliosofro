import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Crown,
  GraduationCap,
  Radio,
  FileEdit,
  Mic,
  Users,
  Shield,
  Scroll,
  Calendar,
  Building,
  Briefcase,
  Award,
  BookOpen,
  Globe,
  Star,
  Lightbulb,
  Target,
  Layers,
} from "lucide-react";
import { useAdminPositions } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { confirmDelete } from "@/lib/confirm";
import { Pagination, usePagination } from "@/components/admin/Pagination";

const ICON_OPTIONS = [
  { key: "crown", Icon: Crown },
  { key: "academic", Icon: GraduationCap },
  { key: "radio", Icon: Radio },
  { key: "editor", Icon: FileEdit },
  { key: "mic", Icon: Mic },
  { key: "users", Icon: Users },
  { key: "shield", Icon: Shield },
  { key: "scroll", Icon: Scroll },
  { key: "calendar", Icon: Calendar },
  { key: "building", Icon: Building },
  { key: "briefcase", Icon: Briefcase },
  { key: "award", Icon: Award },
  { key: "book", Icon: BookOpen },
  { key: "globe", Icon: Globe },
  { key: "star", Icon: Star },
  { key: "lightbulb", Icon: Lightbulb },
  { key: "target", Icon: Target },
  { key: "layers", Icon: Layers },
];

const EMPTY = { title: "", organization: "", description: "", icon: "" };

function PositionModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      initial?.id
        ? await api.positions.update(initial.id, form)
        : await api.positions.create(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="font-semibold">
            {initial?.id ? "Edit Position" : "New Position"}
          </p>
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded hover:bg-muted text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {[
            ["Title", "title", true],
            ["Organization", "organization", true],
          ].map(([label, k, req]) => (
            <div key={k} className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                {label}
              </label>
              <input
                required={req}
                value={form[k] ?? ""}
                onChange={(e) => set(k, e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("icon", key)}
                  className={`grid size-10 place-items-center rounded-lg border transition ${
                    form.icon === key
                      ? "border-electric bg-electric/15 text-electric"
                      : "border-border text-muted-foreground hover:border-electric/40 hover:text-foreground"
                  }`}
                  title={key}
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 resize-none"
            />
          </div>
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

export default function AdminPositions() {
  const raw = useAdminPositions() ?? [];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    setItems(raw);
  }, [raw]);

  const filtered = items.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.organization?.toLowerCase().includes(search.toLowerCase()),
  );
  const { page, setPage, totalPages, paginated } = usePagination(
    filtered,
    search,
  );

  const refresh = async () => {
    const res = await api.positions.list({ pageSize: 999 });
    setItems(res.data ?? []);
  };
  const del = async (id) => {
    if (!(await confirmDelete("This position will be permanently deleted.")))
      return;
    await api.positions.remove(id);
    setItems((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Positions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Academic and administrative roles
          </p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 transition shrink-0"
        >
          <Plus className="size-4" /> New
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
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Organization
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.organization}
                </td>
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
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  No positions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          setPage={setPage}
        />
      </div>
      {modal && (
        <PositionModal
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
