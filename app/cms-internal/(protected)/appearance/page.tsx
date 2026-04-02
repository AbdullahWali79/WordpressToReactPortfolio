import { AppearanceForm } from "@/components/cms/forms/appearance-form";
import { updateAppearanceAction } from "@/lib/cms/actions/settings-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveThemeSettings } from "@/lib/theme/presets";

export default async function AppearancePage() {
  const supabase = await createSupabaseServerClient();
  const { data: settings } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  const { theme, values } = resolveThemeSettings(settings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Appearance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose one of two advanced visual systems, then fine-tune fonts, color palette, and button shape from one panel.
        </p>
      </div>
      <AppearanceForm action={updateAppearanceAction} initialTheme={theme.id} initialValues={values} />
    </div>
  );
}
