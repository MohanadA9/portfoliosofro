import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useAdminBlogs } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { useResourceList } from "@/lib/useResourceList";
import { confirmDelete } from "@/lib/confirm";
import { Pagination, usePagination } from "@/components/admin/Pagination";

export default function AdminBlogs() {
  const navigate = useNavigate();
  const { data: blogsFallback } = useAdminBlogs();
  const [items, setItems] = useResourceList(api.blogs, blogsFallback ?? []);
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (b) => !search || b.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const { page, setPage, totalPages, paginated } = usePagination(filtered, search);

  const del = async (id) => {
    if (!(await confirmDelete("This blog post will be permanently deleted."))) return;
    await api.blogs.remove(id);
    setItems((p) => p.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">Articles and opinion pieces</p>
        </div>
        <button
          onClick={() => navigate("/admin/blogs/new")}
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
                Category
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Date
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
                <td className="px-4 py-3 font-medium max-w-[260px] truncate">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(`/admin/blogs/${item.id}/edit`)}
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
                  No blog posts found
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
