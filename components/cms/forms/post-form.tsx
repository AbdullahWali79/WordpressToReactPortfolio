"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MediaBrowser } from "@/components/cms/media-browser";
import { ImageUrlPreview } from "@/components/cms/image-url-preview";
import { SeoScorePanel } from "@/components/cms/seo-score-panel";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import type { MediaItem } from "@/types/database";

type Option = { id: string; name: string; slug: string };

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Option[];
  tags: Option[];
  mediaItems: MediaItem[];
  previewHref?: string;
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    featured_image_url?: string | null;
    image_alt?: string | null;
    category_id?: string | null;
    status?: "draft" | "published";
    tag_ids?: string[];
    seo_title?: string | null;
    meta_description?: string | null;
    focus_keyword?: string | null;
    canonical_url?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image_url?: string | null;
    schema_type?: string | null;
    robots?: "index,follow" | "noindex,nofollow" | string | null;
  };
};

export function PostForm({ action, categories, tags, mediaItems, previewHref, initial }: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [content, setContent] = useState(initial?.content ?? "<p></p>");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initial?.featured_image_url ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initial?.focus_keyword ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonical_url ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(initial?.og_image_url ?? "");

  const derivedSlug = useMemo(() => slugify(title), [title]);

  const currentSlug = slugTouched ? slug : derivedSlug;

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="status" value={status} />

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Post Details</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={currentSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={initial?.excerpt ?? ""} rows={3} />
            </div>

            <div>
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={initial?.category_id ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border p-3">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={tag.id}
                      defaultChecked={initial?.tag_ids?.includes(tag.id)}
                      className="rounded border-input"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Content</Label>
              <div className="mt-2">
                <TiptapEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Featured Image</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="featured_image_url">Featured image URL</Label>
              <Input
                id="featured_image_url"
                name="featured_image_url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image_alt">Image alt text</Label>
              <Input id="image_alt" name="image_alt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
            </div>
          </div>
          <ImageUrlPreview url={featuredImageUrl} alt={imageAlt || title} />
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">SEO</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="seo_title">SEO title</Label>
              <Input id="seo_title" name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="meta_description">Meta description</Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="focus_keyword">Focus keyword</Label>
              <Input
                id="focus_keyword"
                name="focus_keyword"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input
                id="canonical_url"
                name="canonical_url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://example.com/blog/slug"
              />
            </div>
            <div>
              <Label htmlFor="og_title">Open Graph title</Label>
              <Input id="og_title" name="og_title" defaultValue={initial?.og_title ?? ""} />
            </div>
            <div>
              <Label htmlFor="og_image_url">Open Graph image URL</Label>
              <Input id="og_image_url" name="og_image_url" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="og_description">Open Graph description</Label>
              <Textarea id="og_description" name="og_description" rows={2} defaultValue={initial?.og_description ?? ""} />
            </div>
            <div>
              <Label htmlFor="schema_type">Schema type</Label>
              <Input id="schema_type" name="schema_type" defaultValue={initial?.schema_type ?? "BlogPosting"} />
            </div>
            <div>
              <Label htmlFor="robots">Robots</Label>
              <select
                id="robots"
                name="robots"
                defaultValue={initial?.robots ?? "index,follow"}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="index,follow">index,follow</option>
                <option value="noindex,nofollow">noindex,nofollow</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Publishing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="status-select">Status</Label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="submit" variant="outline" onClick={() => setStatus("draft")}>
              Save Draft
            </Button>
            <Button type="submit" onClick={() => setStatus("published")}>
              {initial?.id ? "Update & Publish" : "Publish"}
            </Button>
            {previewHref ? (
              <Button asChild type="button" variant="ghost">
                <Link href={previewHref}>Preview</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <SeoScorePanel
          title={title}
          slug={currentSlug}
          contentHtml={content}
          metaDescription={metaDescription}
          seoTitle={seoTitle}
          focusKeyword={focusKeyword}
          imageAlt={imageAlt}
          canonicalUrl={canonicalUrl}
        />

        <MediaBrowser
          items={mediaItems.filter((item) => item.media_type === "image")}
          onPickFeatured={(url, alt) => {
            setFeaturedImageUrl(url);
            if (!imageAlt) {
              setImageAlt(alt);
            }
          }}
          onPickOg={(url) => setOgImageUrl(url)}
        />
      </div>
    </form>
  );
}
