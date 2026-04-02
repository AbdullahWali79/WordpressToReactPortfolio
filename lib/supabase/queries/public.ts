import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTextExcerpt } from "@/lib/utils";

export const getPublicSettings = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  return data;
});

export async function getPublishedPosts(params?: { categorySlug?: string; tagSlug?: string; query?: string }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("posts")
    .select("id,title,slug,excerpt,featured_image_url,image_alt,published_at,created_at,seo_score")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (params?.query) {
    query = query.or(`title.ilike.%${params.query}%,excerpt.ilike.%${params.query}%`);
  }

  const { data } = await query;

  if (!data?.length) return [];
  if (!params?.categorySlug && !params?.tagSlug) return data;

  let filtered = data;
  if (params.categorySlug) {
    const { data: category } = await supabase.from("categories").select("id").eq("slug", params.categorySlug).single();
    if (!category) return [];
    const { data: byCategory } = await supabase
      .from("posts")
      .select("id,title,slug,excerpt,featured_image_url,image_alt,published_at,created_at,seo_score")
      .eq("status", "published")
      .eq("category_id", category.id)
      .order("published_at", { ascending: false, nullsFirst: false });
    filtered = byCategory ?? [];
  }

  if (params.tagSlug) {
    const { data: tag } = await supabase.from("tags").select("id").eq("slug", params.tagSlug).single();
    if (!tag) return [];
    const { data: pivots } = await supabase.from("post_tags").select("post_id").eq("tag_id", tag.id);
    const ids = (pivots ?? []).map((row) => row.post_id);
    if (!ids.length) return [];
    const { data: taggedPosts } = await supabase
      .from("posts")
      .select("id,title,slug,excerpt,featured_image_url,image_alt,published_at,created_at,seo_score")
      .in("id", ids)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    filtered = taggedPosts ?? [];
  }

  return filtered;
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) return null;

  const { data: category } = post.category_id
    ? await supabase.from("categories").select("id,name,slug").eq("id", post.category_id).maybeSingle()
    : { data: null };
  const { data: pivots } = await supabase.from("post_tags").select("tag_id").eq("post_id", post.id);
  const tagIds = (pivots ?? []).map((row) => row.tag_id);
  const { data: tags } = tagIds.length
    ? await supabase.from("tags").select("id,name,slug").in("id", tagIds)
    : { data: [] as never[] };

  return { ...post, category, tags };
}

export async function getPublishedPortfolio(query?: string) {
  const supabase = await createSupabaseServerClient();
  let request = supabase
    .from("portfolio_projects")
    .select("id,title,slug,short_description,featured_image_url,image_alt,updated_at,seo_score")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (query) {
    request = request.or(`title.ilike.%${query}%,short_description.ilike.%${query}%`);
  }

  const { data } = await request;
  return data ?? [];
}

export async function getPublishedPortfolioBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getPublishedPageBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getSearchResults(keyword: string) {
  const [posts, pages, portfolio] = await Promise.all([
    getPublishedPosts({ query: keyword }),
    (async () => {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase
        .from("pages")
        .select("id,title,slug,content,updated_at")
        .eq("status", "published")
        .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
        .order("updated_at", { ascending: false });
      return (data ?? []).map((row) => ({
        ...row,
        excerpt: getTextExcerpt(row.content),
      }));
    })(),
    getPublishedPortfolio(keyword),
  ]);

  return { posts, pages, portfolio };
}
