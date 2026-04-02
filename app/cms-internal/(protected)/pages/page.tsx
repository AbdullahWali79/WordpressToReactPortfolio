import Link from "next/link";

import { deleteCmsPageAction } from "@/lib/cms/actions/page-actions";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type CmsPagesListProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CmsPagesList({ searchParams }: CmsPagesListProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();

  let request = supabase.from("pages").select("id,title,slug,status,seo_score,updated_at").order("updated_at", { ascending: false });
  if (query) {
    request = request.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
  }
  const { data: pages } = await request;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Pages</h1>
        <Button asChild>
          <Link href={`${cmsBasePath}/pages/new`}>Create Page</Link>
        </Button>
      </div>

      <form>
        <Input name="q" defaultValue={query} placeholder="Search pages..." className="max-w-sm" />
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
            {(pages ?? []).map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-xs text-muted-foreground">/{page.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge>{page.status}</Badge>
                </TableCell>
                <TableCell>{page.seo_score ?? 0}</TableCell>
                <TableCell>{formatDate(page.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`${cmsBasePath}/pages/${page.id}/edit`}>Edit</Link>
                    </Button>
                    <form action={deleteCmsPageAction}>
                      <input type="hidden" name="id" value={page.id} />
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
