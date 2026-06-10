import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { SearchInput, Pagination, Spinner, Empty } from "@/components/common/Primitives";
import { Dropzone } from "@/components/common/Dropzone";
import { confirmDelete } from "@/lib/confirm";
export function CrudPage({ title, subtitle, queryKey, api, columns, fields, defaults }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, search, page],
    queryFn: () =>
      api.list({
        search,
        page,
        pageSize: 10,
      }),
  });
  const refresh = () =>
    qc.invalidateQueries({
      queryKey: [queryKey],
    });
  const save = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) return api.update(payload.id, payload);
      return api.create(payload);
    },
    onSuccess: () => {
      toast.success("Saved successfully");
      setEditing(null);
      refresh();
    },
    onError: () => toast.error("Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => {
      toast.success("Item deleted");
      refresh();
    },
    onError: () => toast.error("Delete failed"),
  });
  const handleDelete = async (id) => {
    if (await confirmDelete()) remove.mutate(id);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={() => setEditing(defaults)}
          className="inline-flex items-center gap-2 rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90"
        >
          <Plus className="size-4" /> New
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {data?.total ?? 0} items
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((row) => (
                  <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                    {columns.map((c) => (
                      <td
                        key={String(c.key)}
                        className={`px-4 py-3 align-top ${c.className ?? ""}`}
                      >
                        {c.render ? (
                          c.render(row)
                        ) : (
                          <span className="text-muted-foreground">{String(row[c.key] ?? "")}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setEditing(row)}
                          className="grid size-8 place-items-center rounded-md border border-border hover:border-electric/60"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="grid size-8 place-items-center rounded-md border border-border hover:border-destructive/60 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-deep/70 backdrop-blur-sm p-4"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">
                {editing.id ? "Edit" : "Create"} {title.replace(/s$/, "")}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="grid size-8 place-items-center rounded-md hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate(editing);
              }}
              className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
            >
              {fields.map((f) => {
                const val = editing[f.name] ?? "";
                const set = (v) =>
                  setEditing({
                    ...editing,
                    [f.name]: v,
                  });
                const cls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
                if (f.type === "image") {
                  return (
                    <div key={f.name}>
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {f.label}
                      </span>
                      <Dropzone
                        value={val || undefined}
                        onChange={(d) => set(d ?? "")}
                        className="mt-1"
                      />
                    </div>
                  );
                }
                return (
                  <label key={f.name} className="block">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      {f.label}
                    </span>
                    {f.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        className={cls}
                      />
                    ) : (
                      <input
                        type={f.type ?? "text"}
                        value={val}
                        onChange={(e) =>
                          set(f.type === "number" ? Number(e.target.value) : e.target.value)
                        }
                        placeholder={f.placeholder}
                        className={cls}
                      />
                    )}
                  </label>
                );
              })}
              <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-card">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-md border border-border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={save.isPending}
                  className="rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {save.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
