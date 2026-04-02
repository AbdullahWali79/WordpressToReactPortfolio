import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ContentRenderer } from "@/components/content/content-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/env";
import { getPublicSettings, getPublishedPageBySlug } from "@/lib/supabase/queries/public";

type DynamicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPublishedPageBySlug(slug), getPublicSettings()]);
  if (!page) return {};
  return buildSeoMetadata({
    title: page.seo_title || page.title,
    description: page.meta_description,
    canonicalUrl: page.canonical_url || `${getSiteUrl()}/page/${page.slug}`,
    ogTitle: page.og_title || page.title,
    ogDescription: page.og_description || page.meta_description,
    ogImageUrl: page.og_image_url || page.featured_image_url,
    robots: page.robots || "index,follow",
    settings,
  });
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">{page.title}</h1>
      {page.featured_image_url ? (
        <img src={page.featured_image_url} alt={page.image_alt || page.title} className="mt-8 h-[320px] w-full rounded-lg object-cover" />
      ) : null}
      <div className="mt-10">
        <ContentRenderer html={page.content} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": page.schema_type || "WebPage",
          name: page.title,
          description: page.meta_description,
          url: `${getSiteUrl()}/page/${page.slug}`,
        }}
      />
    </section>
  );
}
