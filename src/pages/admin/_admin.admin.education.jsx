import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAdminEducation } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { useResourceList } from "@/lib/useResourceList";
import { confirmDelete } from "@/lib/confirm";
import { Pagination, usePagination } from "@/components/admin/Pagination";

const EMPTY = { degree: "", school: "", year: "", focus: "" };

function EduModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(initial ?? {}),
    school: initial?.school ?? initial?.institution ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      initial?.id ? await api.education.update(initial.id, form) : await api.education.create(form);
      onSaved();
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="font-semibold">{initial?.id ? "Edit Education" : "New Education"}</p>
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
              Degree
            </label>
            <input
              required
              value={form.degree}
              onChange={(e) => set("degree", e.target.value)}
              placeholder="Ph.D. in Electrical Engineering"
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              School / Institution
            </label>
            <input
              required
              value={form.school}
              onChange={(e) => set("school", e.target.value)}
              placeholder="Imperial College London"
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Year
              </label>
              <input
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2005"
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Focus / Field
              </label>
              <input
                value={form.focus}
                onChange={(e) => set("focus", e.target.value)}
                placeholder="MIMO, channel estimation…"
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
              />
            </div>
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

export default function AdminEducation() {
  const { data: educationFallback } = useAdminEducation();
  const [items, setItems] = useResourceList(api.education, educationFallback ?? []);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const filtered = items.filter(
    (e) =>
      !search ||
      e.degree?.toLowerCase().includes(search.toLowerCase()) ||
      (e.school ?? e.institution)?.toLowerCase().includes(search.toLowerCase()),
  );
  const { page, setPage, totalPages, paginated } = usePagination(filtered, search);

  const refresh = async () => {
    const res = await api.education.list({ pageSize: 999 });
    setItems(res.data ?? []);
  };
  const del = async (id) => {
    if (!(await confirmDelete("This education entry will be permanently deleted."))) return;
    try {
      await api.education.remove(id);
      setItems((p) => p.filter((e) => e.id !== id));
    } catch (err) {
      toast.error(err?.message || "Failed to delete education entry");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Education</h1>
          <p className="text-sm text-muted-foreground mt-1">Degrees and academic credentials</p>
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
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Degree
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                School
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Year
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
                <td className="px-4 py-3">
                  <div className="size-10 rounded-md bg-electric/10 border border-electric/20 flex items-center justify-center text-electric">
                    <GraduationCap className="size-4" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{item.degree}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.school ?? item.institution}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.year}</td>
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
                <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No education entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} setPage={setPage} />
      </div>
      {modal && (
        <EduModal
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
