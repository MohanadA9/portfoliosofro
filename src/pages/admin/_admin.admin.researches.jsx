import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminResearches } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { useResourceList } from "@/lib/useResourceList";
import { confirmDelete } from "@/lib/confirm";
import { Pagination, usePagination } from "@/components/admin/Pagination";

const STATUS_CHIP = {
  published: "text-green-400 bg-green-400/10",
  "in-review": "text-yellow-400 bg-yellow-400/10",
  draft: "text-muted-foreground bg-muted/40",
};

export default function AdminResearches() {
  const { data: researchesFallback } = useAdminResearches();
  const [items, setItems] = useResourceList(api.researches, researchesFallback ?? []);
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  const filtered = items.filter(
    (r) => !search || r.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const { page, setPage, totalPages, paginated } = usePagination(filtered, search);

  const del = async (id) => {
    if (!(await confirmDelete("This research will be permanently deleted."))) return;
    await api.researches.remove(id);
    setItems((p) => p.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Researches</h1>
          <p className="text-sm text-muted-foreground mt-1">Papers, preprints and publications</p>
        </div>
        <button
          onClick={() => nav("/admin/researches/new")}
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
              <th className="w-16 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Year
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Journal / Conference
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Links
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
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt=""
                      className="size-10 rounded-md object-cover border border-border"
                    />
                  ) : (
                    <div className="size-10 rounded-md bg-muted border border-border flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-4" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium max-w-[280px] truncate">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.year}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                  {item.journal || item.conference || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.doi && (
                      <a
                        href={item.doi}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-electric hover:underline font-mono"
                      >
                        DOI
                      </a>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-electric hover:underline font-mono"
                      >
                        Link
                      </a>
                    )}
                    {item.pdf && item.pdf !== "#" && (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-electric hover:underline font-mono"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => nav(`/admin/researches/${item.id}/edit`)}
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
                <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  No research papers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} setPage={setPage} />
      </div>
    </div>
  );
}
