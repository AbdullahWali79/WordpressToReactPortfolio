"use client";

export function ImageUrlPreview({ url, alt }: { url?: string; alt?: string }) {
  if (!url) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-md border">
      <img src={url} alt={alt || "Preview"} className="h-48 w-full object-cover" />
    </div>
  );
}
