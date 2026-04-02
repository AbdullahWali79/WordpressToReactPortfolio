import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/cms/actions/taxonomy-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Categories</h1>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Create Category</h2>
        <form action={createCategoryAction} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input name="name" placeholder="Category name" required />
          <Input name="slug" placeholder="category-slug" required />
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
            {(categories ?? []).map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <form action={updateCategoryAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={category.id} />
                    <Input name="name" defaultValue={category.name} />
                    <Input name="slug" defaultValue={category.slug} />
                    <Button type="submit" variant="outline" size="sm">
                      Update
                    </Button>
                  </form>
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{formatDate(category.created_at)}</TableCell>
                <TableCell className="text-right">
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
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
