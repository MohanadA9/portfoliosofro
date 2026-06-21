import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Pagination, Select, Spinner, Empty } from "@/components/common/Primitives";
import { api } from "@/api/client";
function ResearchesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [page, setPage] = useState(1);
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["pub-research"],
    queryFn: () => api.public.researches.list({ pageSize: 1000 }),
  });

  const processedData = useMemo(() => {
    if (!rawData?.data) return { data: [], total: 0, totalPages: 1 };

    let items = [...rawData.data];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.abstract?.toLowerCase().includes(q) ||
          r.journal?.toLowerCase().includes(q) ||
          r.authors?.some((author) => author.toLowerCase().includes(q)) ||
          r.keywords?.some((keyword) => keyword.toLowerCase().includes(q))
      );
    }

    if (sortBy === "year") {
      items.sort((a, b) => b.year - a.year);
    } else if (sortBy === "title") {
      items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "journal") {
      items.sort((a, b) => (a.journal || "").localeCompare(b.journal || ""));
    }

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
  }, [rawData, search, sortBy, page]);

  const data = processedData;
  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Research"
        subtitle="Peer-reviewed journal articles, conference papers, and technical reports."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by title, keyword, author…"
          />
          <Select
            label="Sort by"
            value={sortBy}
            onChange={setSortBy}
            options={[
              {
                value: "year",
                label: "Year",
              },
              {
                value: "title",
                label: "Title",
              },
              {
                value: "journal",
                label: "Journal",
              },
            ]}
          />
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((r) => (
              <CoverCard
                key={r.id}
                to={`/researches/${r.id}`}
                cover={r.cover}
                eyebrow={String(r.year)}
                title={r.title}
                meta={r.abstract}
                footer={`${r.authors.join(", ")} • ${r.journal}`}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
      </section>
    </>
  );
}
export default ResearchesPage;
