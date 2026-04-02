import type { Metadata } from "next";

import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildSeoMetadata({
    title: "Contact",
    description: "Get in touch for new projects and collaboration.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    settings,
  });
}

export default async function ContactPage() {
  const settings = await getPublicSettings();
  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Contact</h1>
      <div className="mt-8 space-y-3 text-muted-foreground">
        <p>Email: {settings?.contact_email || "hello@example.com"}</p>
        {settings?.phone_number ? <p>Phone: {settings.phone_number}</p> : null}
        {settings?.address ? <p>Address: {settings.address}</p> : null}
      </div>
    </section>
  );
}
