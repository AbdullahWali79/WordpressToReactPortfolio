import type { Metadata } from "next";

import "@/app/globals.css";

import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: settings?.default_seo_title ?? settings?.site_name ?? "Custom CMS",
    description: settings?.default_meta_description ?? settings?.site_description ?? "",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-[family-name:var(--font-body)]">{children}</body>
    </html>
  );
}
