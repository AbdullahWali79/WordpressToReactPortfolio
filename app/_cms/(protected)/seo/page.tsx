import Link from "next/link";

import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SeoOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();

  const [posts, pages, portfolio] = await Promise.all([
    supabase.from("posts").select("id,title,seo_score,status").order("updated_at", { ascending: false }).limit(20),
    supabase.from("pages").select("id,title,seo_score,status").order("updated_at", { ascending: false }).limit(20),
    supabase
      .from("portfolio_projects")
      .select("id,title,seo_score,status")
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  const items = [
    ...(posts.data ?? []).map((item) => ({ ...item, type: "post", href: `${cmsBasePath}/posts/${item.id}/edit` })),
    ...(pages.data ?? []).map((item) => ({ ...item, type: "page", href: `${cmsBasePath}/pages/${item.id}/edit` })),
    ...(portfolio.data ?? []).map((item) => ({ ...item, type: "portfolio", href: `${cmsBasePath}/portfolio/${item.id}/edit` })),
  ];

  const warnings = items.filter((item) => (item.seo_score ?? 0) < 70);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">SEO Quality Overview</h1>

      <Card>
        <CardHeader>
          <CardTitle>SEO Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {warnings.length ? (
            warnings.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={item.href} className="block rounded border p-3 hover:bg-muted">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{item.status}</Badge>
                    <Badge className="bg-red-50 text-red-700">Score {item.seo_score ?? 0}</Badge>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No immediate SEO warnings found in the latest entries.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
