import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/env";
import type { SiteSettings } from "@/types/database";

type MetadataInput = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  robots?: string | null;
  settings?: SiteSettings | null;
};

export function buildSeoMetadata(input: MetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const title = input.title || input.settings?.default_seo_title || input.settings?.site_name || "Website";
  const description =
    input.description || input.settings?.default_meta_description || input.settings?.site_description || "";
  const canonical = input.canonicalUrl || siteUrl;
  const ogImage = input.ogImageUrl || input.settings?.default_og_image_url || undefined;
  const robots = input.robots || "index,follow";

  return {
    title,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      url: canonical,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.ogTitle || title,
      description: input.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
