import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();

  const [postCount, pageCount, portfolioCount, draftCount, recentPosts, recentPages, recentPortfolio] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("pages").select("*", { count: "exact", head: true }),
      supabase.from("portfolio_projects").select("*", { count: "exact", head: true }),
      Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("pages").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("portfolio_projects").select("*", { count: "exact", head: true }).eq("status", "draft"),
      ]),
      supabase.from("posts").select("id,title,status,updated_at,seo_score").order("updated_at", { ascending: false }).limit(5),
      supabase.from("pages").select("id,title,status,updated_at,seo_score").order("updated_at", { ascending: false }).limit(5),
      supabase
        .from("portfolio_projects")
        .select("id,title,status,updated_at,seo_score")
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

  const totalDrafts = (draftCount[0].count ?? 0) + (draftCount[1].count ?? 0) + (draftCount[2].count ?? 0);

  const allScores = [
    ...(recentPosts.data ?? []),
    ...(recentPages.data ?? []),
    ...(recentPortfolio.data ?? []),
  ];

  const seoWarnings = allScores.filter((item) => (item.seo_score ?? 0) < 70).length;

  return {
    totals: {
      posts: postCount.count ?? 0,
      pages: pageCount.count ?? 0,
      portfolio: portfolioCount.count ?? 0,
      drafts: totalDrafts,
      seoWarnings,
    },
    recent: {
      posts: recentPosts.data ?? [],
      pages: recentPages.data ?? [],
      portfolio: recentPortfolio.data ?? [],
    },
  };
}

export async function getAdminTaxonomies() {
  const supabase = await createSupabaseServerClient();
  const [categories, tags] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);
  return {
    categories: categories.data ?? [],
    tags: tags.data ?? [],
  };
}
