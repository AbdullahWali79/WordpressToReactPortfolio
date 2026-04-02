"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaItem } from "@/types/database";

type MediaBrowserProps = {
  items: MediaItem[];
  onPickFeatured?: (url: string, alt: string) => void;
  onPickOg?: (url: string) => void;
};

export function MediaBrowser({ items, onPickFeatured, onPickOg }: MediaBrowserProps) {
  const [query, setQuery] = useState("");
  const [copyState, setCopyState] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const haystack = `${item.title} ${item.provider ?? ""} ${item.source_url}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <aside className="space-y-4 rounded-lg border bg-card p-4">
      <div>
        <h3 className="text-lg font-semibold">Saved Media</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Save image or video URLs in Media first, then reuse them here while editing content.
        </p>
      </div>

      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved media..." />

      <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-md border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge>{item.media_type}</Badge>
                  {item.provider ? <Badge>{item.provider}</Badge> : null}
                </div>
              </div>
              {item.thumbnail_url || item.media_type === "image" ? (
                <img
                  src={item.thumbnail_url || item.source_url}
                  alt={item.alt_text || item.title}
                  className="h-16 w-16 rounded-md object-cover"
                />
              ) : null}
            </div>

            <p className="mt-2 line-clamp-2 break-all text-xs text-muted-foreground">{item.source_url}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(item.source_url);
                  setCopyState(item.id);
                  window.setTimeout(() => setCopyState(null), 1500);
                }}
              >
                {copyState === item.id ? "Copied" : "Copy URL"}
              </Button>

              {item.media_type === "image" && onPickFeatured ? (
                <Button type="button" size="sm" onClick={() => onPickFeatured(item.source_url, item.alt_text || item.title)}>
                  Use as Featured
                </Button>
              ) : null}

              {item.media_type === "image" && onPickOg ? (
                <Button type="button" size="sm" variant="ghost" onClick={() => onPickOg(item.source_url)}>
                  Use as OG
                </Button>
              ) : null}
            </div>
          </div>
        ))}

        {!filteredItems.length ? <p className="text-sm text-muted-foreground">No saved media matched your search.</p> : null}
      </div>
    </aside>
  );
}
