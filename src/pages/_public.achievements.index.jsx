import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Pagination, Spinner, Empty } from "@/components/common/Primitives";
import { api } from "@/api/client";
function AchievementsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => api.public.achievements.list({ pageSize: 1000 }),
  });

  const processedData = useMemo(() => {
    if (!rawData?.data) return { data: [], total: 0, totalPages: 1 };

    let items = [...rawData.data];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageSize = 9;
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const paginated = items.slice(start, start + pageSize);

    return {
      data: paginated,
      total,
      totalPages,
    };
  }, [rawData, search, page]);

  const data = processedData;
  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        title="Achievements"
        subtitle="Awards, grants, editorships, keynotes, and patents collected over the years."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search achievements…"
          />
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {data?.total ?? 0} results
          </p>
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((a) => (
              <CoverCard
                key={a.id}
                to={`/achievements/${a.id}`}
                cover={a.cover}
                eyebrow={a.category}
                title={a.title}
                meta={a.description}
                footer={new Date(a.date).toLocaleDateString()}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
      </section>
    </>
  );
}
export default AchievementsPage;