import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Spinner, Empty, Pagination } from "@/components/common/Primitives";
import { api } from "@/api/client";
function BlogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["pub-blog"],
    queryFn: () => api.public.blogs.list({ pageSize: 1000 }),
  });

  const processedData = useMemo(() => {
    if (!rawData?.data) return { data: [], total: 0, totalPages: 1 };

    let items = [...rawData.data];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
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
        eyebrow="Writing"
        title="Blog"
        subtitle="Short essays on research, teaching, and the future of communications."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search posts…"
          />
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((b) => (
              <CoverCard
                key={b.id}
                to={`/blog/${b.slug}`}
                cover={b.cover}
                eyebrow={new Date(b.date).toLocaleDateString()}
                title={b.title}
                meta={b.excerpt}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
      </section>
    </>
  );
}
export default BlogPage;
