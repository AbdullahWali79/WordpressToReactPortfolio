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

// Get publishing activity for charts
export async function getPublishingActivity(days: number = 30) {
  const supabase = await createSupabaseServerClient();
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  const [posts, pages, portfolio] = await Promise.all([
    supabase
      .from("posts")
      .select("published_at, status")
      .gte("published_at", startDate.toISOString())
      .lte("published_at", endDate.toISOString()),
    supabase
      .from("pages")
      .select("published_at, status")
      .gte("published_at", startDate.toISOString())
      .lte("published_at", endDate.toISOString()),
    supabase
      .from("portfolio_projects")
      .select("published_at, status")
      .gte("published_at", startDate.toISOString())
      .lte("published_at", endDate.toISOString()),
  ]);
  
  // Group by date
  const activity: Record<string, { posts: number; pages: number; portfolio: number }> = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    activity[dateStr] = { posts: 0, pages: 0, portfolio: 0 };
  }
  
  (posts.data || []).forEach((item) => {
    if (item.published_at) {
      const dateStr = item.published_at.split("T")[0];
      if (activity[dateStr]) {
        activity[dateStr].posts++;
      }
    }
  });
  
  (pages.data || []).forEach((item) => {
    if (item.published_at) {
      const dateStr = item.published_at.split("T")[0];
      if (activity[dateStr]) {
        activity[dateStr].pages++;
      }
    }
  });
  
  (portfolio.data || []).forEach((item) => {
    if (item.published_at) {
      const dateStr = item.published_at.split("T")[0];
      if (activity[dateStr]) {
        activity[dateStr].portfolio++;
      }
    }
  });
  
  return Object.entries(activity)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Get content status distribution
export async function getContentStatusDistribution() {
  const supabase = await createSupabaseServerClient();
  
  const [posts, pages, portfolio] = await Promise.all([
    supabase.from("posts").select("status"),
    supabase.from("pages").select("status"),
    supabase.from("portfolio_projects").select("status"),
  ]);
  
  const published = 
    (posts.data || []).filter((i) => i.status === "published").length +
    (pages.data || []).filter((i) => i.status === "published").length +
    (portfolio.data || []).filter((i) => i.status === "published").length;
  
  const drafts = 
    (posts.data || []).filter((i) => i.status === "draft").length +
    (pages.data || []).filter((i) => i.status === "draft").length +
    (portfolio.data || []).filter((i) => i.status === "draft").length;
  
  const scheduled = 
    (posts.data || []).filter((i) => i.status === "scheduled").length +
    (pages.data || []).filter((i) => i.status === "scheduled").length +
    (portfolio.data || []).filter((i) => i.status === "scheduled").length;
  
  return [
    { name: "Published", value: published, color: "#22c55e" },
    { name: "Drafts", value: drafts, color: "#f59e0b" },
    { name: "Scheduled", value: scheduled, color: "#3b82f6" },
  ];
}

// Get SEO score distribution
export async function getSeoScoreDistribution() {
  const supabase = await createSupabaseServerClient();
  
  const [posts, pages, portfolio] = await Promise.all([
    supabase.from("posts").select("seo_score"),
    supabase.from("pages").select("seo_score"),
    supabase.from("portfolio_projects").select("seo_score"),
  ]);
  
  const allItems = [...(posts.data || []), ...(pages.data || []), ...(portfolio.data || [])];
  
  const ranges = {
    excellent: 0, // 90-100
    good: 0,      // 70-89
    average: 0,   // 50-69
    poor: 0,      // 0-49
  };
  
  allItems.forEach((item) => {
    const score = item.seo_score || 0;
    if (score >= 90) ranges.excellent++;
    else if (score >= 70) ranges.good++;
    else if (score >= 50) ranges.average++;
    else ranges.poor++;
  });
  
  return [
    { name: "Excellent (90-100)", value: ranges.excellent, color: "#22c55e" },
    { name: "Good (70-89)", value: ranges.good, color: "#84cc16" },
    { name: "Average (50-69)", value: ranges.average, color: "#f59e0b" },
    { name: "Poor (0-49)", value: ranges.poor, color: "#ef4444" },
  ];
}
