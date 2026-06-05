import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { SearchInput, Empty, Spinner } from "@/components/common/Primitives";
import { Dropzone } from "@/components/common/Dropzone";
import { Image as ImageIcon, FileText, File as FileIcon, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { confirmDelete } from "@/lib/confirm";

export const Route = createFileRoute("/_admin/admin/media")({
  component: MediaPage,
});

const ICON = { image: ImageIcon, pdf: FileText, doc: FileIcon } as const;

function MediaPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | undefined>();
  const [pendingName, setPendingName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media", search],
    queryFn: () => api.media.list({ search, pageSize: 50 }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.media.remove(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-media"] }); },
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!pending) throw new Error("No file");
      const sizeKb = Math.round((pending.length * 0.75) / 1024);
      return api.media.create({
        name: pendingName || `upload-${Date.now()}.jpg`,
        type: "image",
        url: pending,
        size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
      } as any);
    },
    onSuccess: () => {
      toast.success("Uploaded");
      setPending(undefined); setPendingName("");
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: () => toast.error("Upload failed"),
  });

  const handleDelete = async (id: string) => { if (await confirmDelete()) remove.mutate(id); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag &amp; drop to upload images, PDFs, and documents.</p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><UploadCloud className="size-4 text-electric" /> Upload new file</h2>
        <Dropzone value={pending} onChange={setPending} />
        {pending && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              placeholder="File name (optional)"
              className="flex-1 min-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              disabled={upload.isPending}
              onClick={() => upload.mutate()}
              className="rounded-md bg-electric px-5 py-2 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60"
            >
              {upload.isPending ? "Uploading…" : "Save to library"}
            </button>
          </div>
        )}
      </section>

      <SearchInput value={search} onChange={setSearch} placeholder="Search media…" />

      {isLoading ? <Spinner /> : !data?.data.length ? <Empty /> : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.data.map((m: any) => {
            const Icon = ICON[m.type as keyof typeof ICON] ?? FileIcon;
            return (
              <div key={m.id} className="group relative rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-square bg-muted/30 grid place-items-center">
                  {m.type === "image" ? <img src={m.url} className="size-full object-cover" alt="" /> : <Icon className="size-10 text-muted-foreground" />}
                </div>
                <div className="p-2.5 text-xs">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="text-muted-foreground">{m.size}</p>
                </div>
                <button onClick={() => handleDelete(m.id)} className="absolute top-2 right-2 grid size-7 place-items-center rounded-md bg-deep/60 backdrop-blur border border-border opacity-0 group-hover:opacity-100 transition hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
