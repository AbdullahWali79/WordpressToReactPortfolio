import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildSeoMetadata({
    title: "Services",
    description: "Content systems, engineering support, and SEO implementation.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
    settings,
  });
}

const services = [
  {
    title: "CMS Engineering",
    description: "Custom content architecture with secure publishing and role-based workflows.",
  },
  {
    title: "Technical SEO",
    description: "Metadata, schema, content scoring, and crawlability optimization.",
  },
  {
    title: "Performance Optimization",
    description: "Server-rendered pages, caching strategy, and Core Web Vitals tuning.",
  },
];

export default function ServicesPage() {
  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Services</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
