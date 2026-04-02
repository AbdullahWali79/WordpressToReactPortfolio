"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ImageUrlPreview } from "@/components/cms/image-url-preview";
import { SeoScorePanel } from "@/components/cms/seo-score-panel";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

type PortfolioFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  previewHref?: string;
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    short_description?: string | null;
    full_description?: string;
    technologies?: string[] | null;
    project_url?: string | null;
    github_url?: string | null;
    featured_image_url?: string | null;
    image_alt?: string | null;
    status?: "draft" | "published";
    seo_title?: string | null;
    meta_description?: string | null;
    focus_keyword?: string | null;
    canonical_url?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image_url?: string | null;
    schema_type?: string | null;
    robots?: string | null;
  };
};

export function PortfolioForm({ action, previewHref, initial }: PortfolioFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [content, setContent] = useState(initial?.full_description ?? "<p></p>");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initial?.featured_image_url ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initial?.focus_keyword ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonical_url ?? "");

  const derivedSlug = useMemo(() => slugify(title), [title]);
  const currentSlug = slugTouched ? slug : derivedSlug;

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <input type="hidden" name="full_description" value={content} />
        <input type="hidden" name="status" value={status} />

        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Project Details</h2>
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
              <Label htmlFor="short_description">Short description</Label>
              <Textarea id="short_description" name="short_description" rows={3} defaultValue={initial?.short_description ?? ""} />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies (comma separated)</Label>
              <Input id="technologies" name="technologies" defaultValue={(initial?.technologies || []).join(", ")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="project_url">Project URL</Label>
                <Input id="project_url" name="project_url" defaultValue={initial?.project_url ?? ""} />
              </div>
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" name="github_url" defaultValue={initial?.github_url ?? ""} />
              </div>
            </div>
            <div>
              <Label>Full description</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="og_title">Open Graph title</Label>
              <Input id="og_title" name="og_title" defaultValue={initial?.og_title ?? ""} />
            </div>
            <div>
              <Label htmlFor="og_image_url">Open Graph image URL</Label>
              <Input id="og_image_url" name="og_image_url" defaultValue={initial?.og_image_url ?? ""} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="og_description">Open Graph description</Label>
              <Textarea id="og_description" name="og_description" rows={2} defaultValue={initial?.og_description ?? ""} />
            </div>
            <div>
              <Label htmlFor="schema_type">Schema type</Label>
              <Input id="schema_type" name="schema_type" defaultValue={initial?.schema_type ?? "CreativeWork"} />
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
          <div>
            <Label htmlFor="status-select">Status</Label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
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
    </form>
  );
}
