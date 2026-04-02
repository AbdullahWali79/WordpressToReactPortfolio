import { notFound } from "next/navigation";

import { PageForm } from "@/components/cms/forms/page-form";
import { getCmsBasePath } from "@/lib/env";
import { updateCmsPageAction } from "@/lib/cms/actions/page-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditCmsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCmsPage({ params }: EditCmsPageProps) {
  const { id } = await params;
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();
  const { data: page } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  if (!page) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Edit Page</h1>
      <PageForm action={updateCmsPageAction} previewHref={`${cmsBasePath}/preview/page/${id}`} initial={page} />
    </div>
  );
}
