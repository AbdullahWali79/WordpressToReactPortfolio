import { notFound } from "next/navigation";

import { PortfolioForm } from "@/components/cms/forms/portfolio-form";
import { getCmsBasePath } from "@/lib/env";
import { updatePortfolioAction } from "@/lib/cms/actions/portfolio-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditPortfolioPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { id } = await params;
  const cmsBasePath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();
  const { data: project } = await supabase.from("portfolio_projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Edit Project</h1>
      <PortfolioForm action={updatePortfolioAction} previewHref={`${cmsBasePath}/preview/portfolio/${id}`} initial={project} />
    </div>
  );
}
