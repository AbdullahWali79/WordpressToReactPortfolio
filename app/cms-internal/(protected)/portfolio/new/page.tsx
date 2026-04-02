import { PortfolioForm } from "@/components/cms/forms/portfolio-form";
import { createPortfolioAction } from "@/lib/cms/actions/portfolio-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewPortfolioPage() {
  const supabase = await createSupabaseServerClient();
  const { data: mediaItems } = await supabase.from("media_items").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Add Project</h1>
      <PortfolioForm action={createPortfolioAction} mediaItems={mediaItems ?? []} />
    </div>
  );
}
