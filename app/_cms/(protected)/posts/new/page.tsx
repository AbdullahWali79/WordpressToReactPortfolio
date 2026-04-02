import { PostForm } from "@/components/cms/forms/post-form";
import { createPostAction } from "@/lib/cms/actions/post-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const supabase = await createSupabaseServerClient();
  const [categories, tags] = await Promise.all([
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("tags").select("id,name,slug").order("name"),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Create Post</h1>
      <PostForm action={createPostAction} categories={categories.data ?? []} tags={tags.data ?? []} />
    </div>
  );
}
