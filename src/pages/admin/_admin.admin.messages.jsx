import { useState, useEffect } from "react";
import { Search, Trash2, X, Mail, MailOpen } from "lucide-react";
import { useAdminMessages } from "@/context/AdminDataContext";
import { api } from "@/api/client";
import { confirmDelete } from "@/lib/confirm";
import { Pagination, usePagination } from "@/components/admin/Pagination";

function MessagePanel({ msg, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="font-semibold">Message</p>
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded hover:bg-muted text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                From
              </p>
              <p className="text-sm font-medium">{msg.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Date
              </p>
              <p className="text-sm text-muted-foreground">{msg.date}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Email
            </p>
            <a href={`mailto:${msg.email}`} className="text-sm text-electric hover:underline">
              {msg.email}
            </a>
          </div>
          {msg.subject && (
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Subject
              </p>
              <p className="text-sm font-medium">{msg.subject}</p>
            </div>
          )}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Message
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {msg.body ?? msg.message}
            </p>
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-border">
          <a
            href={`mailto:${msg.email}`}
            className="px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Reply by Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const raw = useAdminMessages() ?? [];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setItems(raw);
  }, [raw]);

  const filtered = items.filter(
    (m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()),
  );
  const { page, setPage, totalPages, paginated } = usePagination(filtered, search);

  const unread = items.filter((m) => !m.read).length;
  const del = async (id, e) => {
    e.stopPropagation();
    if (!(await confirmDelete("This message will be permanently deleted."))) return;
    await api.messages.remove(id);
    setItems((p) => p.filter((m) => m.id !== id));
  };
  const open = (msg) => {
    setSelected(msg);
    if (!msg.read) {
      api.messages.markRead(msg.id);
      setItems((p) => p.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unread > 0 ? (
              <>
                <span className="text-electric font-medium">{unread} unread</span> · {items.length}{" "}
                total
              </>
            ) : (
              `${items.length} messages`
            )}
          </p>
        </div>
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
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Subject
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
            {paginated.map((msg) => (
              <tr
                key={msg.id}
                onClick={() => open(msg)}
                className={`border-b border-border/60 last:border-0 cursor-pointer hover:bg-muted/30 transition-colors ${!msg.read ? "font-semibold" : ""}`}
              >
                <td className="px-4 py-3 text-center">
                  {msg.read ? (
                    <MailOpen className="size-4 text-muted-foreground mx-auto" />
                  ) : (
                    <Mail className="size-4 text-electric mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <p>{msg.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{msg.email}</p>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground font-normal">
                  {msg.subject}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-normal">{msg.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => del(msg.id, e)}
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
                  No messages
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} total={filtered.length} setPage={setPage} />
      </div>
      {selected && <MessagePanel msg={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
