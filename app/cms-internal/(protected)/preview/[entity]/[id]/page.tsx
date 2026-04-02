import { notFound } from "next/navigation";

import { ContentRenderer } from "@/components/content/content-renderer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PreviewPageProps = {
  params: Promise<{ entity: string; id: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { entity, id } = await params;
  const supabase = await createSupabaseServerClient();

  if (entity === "post") {
    const { data } = await supabase.from("posts").select("title,content").eq("id", id).maybeSingle();
    if (!data) notFound();
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <ContentRenderer html={data.content} />
      </div>
    );
  }

  if (entity === "page") {
    const { data } = await supabase.from("pages").select("title,content").eq("id", id).maybeSingle();
    if (!data) notFound();
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <ContentRenderer html={data.content} />
      </div>
    );
  }

  if (entity === "portfolio") {
    const { data } = await supabase.from("portfolio_projects").select("title,full_description").eq("id", id).maybeSingle();
    if (!data) notFound();
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <ContentRenderer html={data.full_description} />
      </div>
    );
  }

  notFound();
}
