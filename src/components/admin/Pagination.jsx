import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 10;

export function usePagination(filtered, search) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  return { page: safePage, setPage, totalPages, paginated };
}

export function Pagination({ page, totalPages, total, setPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  let last = 0;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      if (last && i - last > 1) pages.push("...");
      pages.push(i);
      last = i;
    }
  }

  const btn = "grid size-8 place-items-center rounded-md text-sm transition";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-xs text-muted-foreground font-mono">
        {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`${btn} border border-border text-muted-foreground hover:border-electric/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`d${i}`}
              className="grid size-8 place-items-center text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`${btn} ${p === page ? "bg-electric text-electric-foreground font-medium" : "border border-border text-muted-foreground hover:border-electric/60 hover:text-foreground"}`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`${btn} border border-border text-muted-foreground hover:border-electric/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
