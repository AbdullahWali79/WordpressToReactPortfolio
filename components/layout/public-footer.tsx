import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function PublicFooter() {
  const settings = await getPublicSettings();
  return (
    <footer className="border-t bg-card">
      <div className="container-main py-8 text-sm text-muted-foreground">
        <p>{settings?.footer_text ?? `© ${new Date().getFullYear()} ${settings?.site_name ?? "Custom CMS"}`}</p>
      </div>
    </footer>
  );
}
