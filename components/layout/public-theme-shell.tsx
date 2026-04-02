import type { CSSProperties } from "react";

import { buildThemeCssVariables, getThemePreset } from "@/lib/theme/presets";
import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function PublicThemeShell({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  const theme = getThemePreset(settings?.active_theme);
  const style = buildThemeCssVariables(settings) as CSSProperties;

  return (
    <div className="public-theme min-h-screen" data-theme={theme.id} style={style}>
      {children}
    </div>
  );
}
