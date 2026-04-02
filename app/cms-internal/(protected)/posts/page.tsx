import Link from "next/link";

import { deletePostAction } from "@/lib/cms/actions/post-actions";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type CmsPostsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CmsPostsPage({ searchParams }: CmsPostsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();

  let request = supabase
    .from("posts")
    .select("id,title,slug,status,seo_score,updated_at,published_at")
    .order("updated_at", { ascending: false });

  if (query) {
    request = request.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
  }

  const { data: posts } = await request;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Posts</h1>
        <Button asChild>
          <Link href={`${cmsBasePath}/posts/new`}>Create Post</Link>
        </Button>
      </div>

      <form>
        <Input name="q" defaultValue={query} placeholder="Search posts..." className="max-w-sm" />
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
            {(posts ?? []).map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{post.status}</Badge>
                </TableCell>
                <TableCell>{post.seo_score ?? 0}</TableCell>
                <TableCell>{formatDate(post.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`${cmsBasePath}/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
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
