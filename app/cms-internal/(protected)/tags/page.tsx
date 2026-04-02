import { createTagAction, deleteTagAction, updateTagAction } from "@/lib/cms/actions/taxonomy-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function TagsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Tags</h1>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Create Tag</h2>
        <form action={createTagAction} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input name="name" placeholder="Tag name" required />
          <Input name="slug" placeholder="tag-slug" required />
          <Button type="submit">Create</Button>
        </form>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(tags ?? []).map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <form action={updateTagAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={tag.id} />
                    <Input name="name" defaultValue={tag.name} />
                    <Input name="slug" defaultValue={tag.slug} />
                    <Button type="submit" variant="outline" size="sm">
                      Update
                    </Button>
                  </form>
                </TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>{formatDate(tag.created_at)}</TableCell>
                <TableCell className="text-right">
                  <form action={deleteTagAction}>
                    <input type="hidden" name="id" value={tag.id} />
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
  );
}
