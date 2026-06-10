import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";
export function Dropzone({
  value,
  onChange,
  label = "Drag & drop an image, or click to browse",
  className = "",
  accept = "image/*",
  maxMb = 5,
}) {
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState(null);
  const input = useRef(null);
  const handle = useCallback(
    (file) => {
      setErr(null);
      if (!file) return;
      if (file.size > maxMb * 1024 * 1024) {
        setErr(`Max ${maxMb}MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result);
      reader.readAsDataURL(file);
    },
    [maxMb, onChange],
  );
  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        onClick={() => input.current?.click()}
        className={`group relative cursor-pointer rounded-xl border-2 border-dashed transition overflow-hidden
          ${drag ? "border-electric bg-electric/5" : "border-border bg-muted/20 hover:border-electric/50 hover:bg-muted/40"}`}
      >
        <input
          ref={input}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handle(e.target.files?.[0])}
        />
        {value ? (
          <div className="relative aspect-video">
            <img src={value} className="size-full object-cover" alt="" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="absolute top-2 right-2 grid size-8 place-items-center rounded-md bg-deep/70 text-white backdrop-blur border border-white/20 hover:text-destructive"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-4">
            <div className="grid size-12 place-items-center rounded-full bg-electric/10 text-electric">
              <UploadCloud className="size-6" />
            </div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ImageIcon className="size-3" /> PNG · JPG · WEBP · up to {maxMb}MB
            </p>
          </div>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}
