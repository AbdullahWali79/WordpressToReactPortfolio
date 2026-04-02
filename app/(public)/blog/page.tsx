import Link from "next/link";
import type { Metadata } from "next";

import { BlogCard } from "@/components/content/blog-card";
import { Input } from "@/components/ui/input";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSettings, getPublishedPosts } from "@/lib/supabase/queries/public";

type BlogPageProps = {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildSeoMetadata({
    title: "Blog",
    description: "Latest insights and practical guides.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    settings,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const categorySlug = params.category?.trim() || "";
  const tagSlug = params.tag?.trim() || "";
  const supabase = await createSupabaseServerClient();

  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts({
      query: query || undefined,
      categorySlug: categorySlug || undefined,
      tagSlug: tagSlug || undefined,
    }),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("tags").select("id,name,slug").order("name"),
  ]);

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Blog</h1>

      <form className="mt-8 grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-4">
        <Input name="q" defaultValue={query} placeholder="Search posts..." />
        <select
          name="category"
          defaultValue={categorySlug}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {(categories.data ?? []).map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select name="tag" defaultValue={tagSlug} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All tags</option>
          {(tags.data ?? []).map((tag) => (
            <option key={tag.id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
        <button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply filters</button>
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {!posts.length ? <p className="mt-8 text-sm text-muted-foreground">No posts found for the selected filters.</p> : null}

      <div className="mt-10 flex flex-wrap gap-2 text-sm">
        {(categories.data ?? []).map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`} className="rounded-full border px-3 py-1 hover:bg-muted">
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
