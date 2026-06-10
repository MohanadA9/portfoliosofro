import { Search } from "lucide-react";
export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
export function Select({ value, onChange, options, label }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      {label && <span className="text-muted-foreground">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40 hover:border-electric/60"
      >
        Prev
      </button>
      {Array.from({
        length: totalPages,
      }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`min-w-9 rounded-md border px-3 py-1.5 text-sm ${p === page ? "border-electric bg-electric text-electric-foreground" : "border-border hover:border-electric/60"}`}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40 hover:border-electric/60"
      >
        Next
      </button>
    </div>
  );
}
export function Stat({ value, label, icon }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
        {icon && <span className="text-electric">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-gradient-electric">{value}</p>
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
    </div>
  );
}
export function Empty({ message = "Nothing here yet." }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
export function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="size-8 animate-spin rounded-full border-2 border-electric border-t-transparent" />
    </div>
  );
}
