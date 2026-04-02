import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const supabase = await createSupabaseServerClient();

  const [posts, pages, portfolio] = await Promise.all([
    supabase.from("posts").select("slug,updated_at").eq("status", "published"),
    supabase.from("pages").select("slug,updated_at").eq("status", "published"),
    supabase.from("portfolio_projects").select("slug,updated_at").eq("status", "published"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/blog",
    "/portfolio",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postRoutes =
    posts.data?.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  const pageRoutes =
    pages.data?.map((page) => ({
      url: `${siteUrl}/page/${page.slug}`,
      lastModified: new Date(page.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) ?? [];

  const portfolioRoutes =
    portfolio.data?.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })) ?? [];

  return [...staticRoutes, ...postRoutes, ...pageRoutes, ...portfolioRoutes];
}
