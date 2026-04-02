import { notFound } from "next/navigation";

import { PostForm } from "@/components/cms/forms/post-form";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePostAction } from "@/lib/cms/actions/post-actions";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();

  const [postRes, categoriesRes, tagsRes, postTagsRes] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("tags").select("id,name,slug").order("name"),
    supabase.from("post_tags").select("tag_id").eq("post_id", id),
  ]);

  if (!postRes.data) notFound();
  const tagIds = (postTagsRes.data ?? []).map((row) => row.tag_id);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Edit Post</h1>
      <PostForm
        action={updatePostAction}
        categories={categoriesRes.data ?? []}
        tags={tagsRes.data ?? []}
        previewHref={`${cmsBasePath}/preview/post/${id}`}
        initial={{
          ...postRes.data,
          tag_ids: tagIds,
        }}
      />
    </div>
  );
}
