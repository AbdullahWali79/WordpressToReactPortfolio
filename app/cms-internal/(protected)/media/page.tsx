import { deleteMediaAction, createMediaAction } from "@/lib/cms/actions/media-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MediaSourceGuide } from "@/components/cms/media-source-guide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type MediaPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const supabase = await createSupabaseServerClient();

  let request = supabase.from("media_items").select("*").order("created_at", { ascending: false });
  if (query) {
    request = request.or(`title.ilike.%${query}%,provider.ilike.%${query}%,source_url.ilike.%${query}%`);
  }

  const { data: mediaItems } = await request;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Media Library</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save public image and video URLs here. Use GitHub raw links, Google Drive public view links, Canva public links,
          or YouTube URLs.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">Add Media URL</h2>
            <form action={createMediaAction} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Canva hero image" required />
              </div>

              <div>
                <Label htmlFor="media_type">Type</Label>
                <select
                  id="media_type"
                  name="media_type"
                  defaultValue="image"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" name="provider" placeholder="GitHub, Drive, YouTube, Canva" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="source_url">Public URL</Label>
                <Input id="source_url" name="source_url" placeholder="https://..." required />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input id="thumbnail_url" name="thumbnail_url" placeholder="Optional. Useful for videos and Drive links." />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input id="alt_text" name="alt_text" placeholder="Describe the image for SEO and accessibility." />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Example: Drive image uses public view link. YouTube item is for embed/reference."
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit">Save Media URL</Button>
              </div>
            </form>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Saved Media</h2>
              <form>
                <Input name="q" defaultValue={query} placeholder="Search media..." className="w-72" />
              </form>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(mediaItems ?? []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.media_type === "image" ? (
                        <img
                          src={item.thumbnail_url || item.source_url}
                          alt={item.alt_text || item.title}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-md border text-xs text-muted-foreground">
                          Video
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 max-w-[340px] truncate text-xs text-muted-foreground">{item.source_url}</p>
                    </TableCell>
                    <TableCell>
                      <Badge>{item.media_type}</Badge>
                    </TableCell>
                    <TableCell>{item.provider || "-"}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteMediaAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button type="submit" size="sm" variant="danger">
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>

        <MediaSourceGuide />
      </div>
    </div>
  );
}
