import { PageForm } from "@/components/cms/forms/page-form";
import { createCmsPageAction } from "@/lib/cms/actions/page-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewCmsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: mediaItems } = await supabase.from("media_items").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Create Page</h1>
      <PageForm action={createCmsPageAction} mediaItems={mediaItems ?? []} />
    </div>
  );
}
