import Link from "next/link";

import { deletePortfolioAction } from "@/lib/cms/actions/portfolio-actions";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type CmsPortfolioPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CmsPortfolioPage({ searchParams }: CmsPortfolioPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();

  let request = supabase
    .from("portfolio_projects")
    .select("id,title,slug,status,seo_score,updated_at")
    .order("updated_at", { ascending: false });

  if (query) {
    request = request.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
  }

  const { data: projects } = await request;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Portfolio</h1>
        <Button asChild>
          <Link href={`${cmsBasePath}/portfolio/new`}>Add Project</Link>
        </Button>
      </div>

      <form>
        <Input name="q" defaultValue={query} placeholder="Search projects..." className="max-w-sm" />
      </form>

      <div className="rounded-lg border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SEO</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(projects ?? []).map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">/{project.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge>{project.status}</Badge>
                </TableCell>
                <TableCell>{project.seo_score ?? 0}</TableCell>
                <TableCell>{formatDate(project.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`${cmsBasePath}/portfolio/${project.id}/edit`}>Edit</Link>
                    </Button>
                    <form action={deletePortfolioAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <Button size="sm" variant="danger" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
