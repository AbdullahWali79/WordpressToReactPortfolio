import type { Metadata } from "next";

import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildSeoMetadata({
    title: "About",
    description: "Learn about our team, mission, and approach.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    settings,
  });
}

export default function AboutPage() {
  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">About</h1>
      <p className="mt-6 max-w-3xl text-muted-foreground">
        This site runs on a fully custom CMS architecture with secure admin controls, structured content workflows, and
        SEO-focused publishing standards.
      </p>
    </section>
  );
}
