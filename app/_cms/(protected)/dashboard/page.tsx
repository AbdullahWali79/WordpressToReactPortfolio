import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCmsBasePath } from "@/lib/env";
import { getDashboardStats } from "@/lib/supabase/queries/cms";
import { formatDate } from "@/lib/utils";

export default async function CmsDashboardPage() {
  const cmsBasePath = getCmsBasePath();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Posts</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.totals.posts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.totals.pages}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.totals.portfolio}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Drafts</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.totals.drafts}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link className="block text-primary hover:underline" href={`${cmsBasePath}/posts/new`}>
              Create new post
            </Link>
            <Link className="block text-primary hover:underline" href={`${cmsBasePath}/pages/new`}>
              Create new page
            </Link>
            <Link className="block text-primary hover:underline" href={`${cmsBasePath}/portfolio/new`}>
              Add portfolio project
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.totals.seoWarnings} recently updated items have SEO score below 70 and need optimization.
            </p>
            <Link className="mt-3 inline-block text-sm text-primary hover:underline" href={`${cmsBasePath}/seo`}>
              Open SEO panel
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {stats.recent.posts.map((item) => (
              <div key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status} | {formatDate(item.updated_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {stats.recent.pages.map((item) => (
              <div key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status} | {formatDate(item.updated_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {stats.recent.portfolio.map((item) => (
              <div key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status} | {formatDate(item.updated_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
