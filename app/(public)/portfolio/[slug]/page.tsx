import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ContentRenderer } from "@/components/content/content-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/env";
import { getPublicSettings, getPublishedPortfolioBySlug } from "@/lib/supabase/queries/public";
import { formatDate } from "@/lib/utils";

type PortfolioDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PortfolioDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getPublishedPortfolioBySlug(slug), getPublicSettings()]);
  if (!project) return {};
  return buildSeoMetadata({
    title: project.seo_title || project.title,
    description: project.meta_description || project.short_description,
    canonicalUrl: project.canonical_url || `${getSiteUrl()}/portfolio/${project.slug}`,
    ogTitle: project.og_title || project.title,
    ogDescription: project.og_description || project.meta_description || project.short_description,
    ogImageUrl: project.og_image_url || project.featured_image_url,
    robots: project.robots || "index,follow",
    settings,
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailProps) {
  const { slug } = await params;
  const project = await getPublishedPortfolioBySlug(slug);
  if (!project) notFound();

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">{project.title}</h1>
      <p className="mt-4 text-muted-foreground">{project.short_description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(project.technologies || []).map((tech: string) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      {project.featured_image_url ? (
        <img
          src={project.featured_image_url}
          alt={project.image_alt || project.title}
          className="mt-8 h-[360px] w-full rounded-lg object-cover"
        />
      ) : null}

      <div className="mt-10">
        <ContentRenderer html={project.full_description} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {project.project_url ? (
          <Link className="text-primary hover:underline" href={project.project_url} target="_blank">
            Live Project
          </Link>
        ) : null}
        {project.github_url ? (
          <Link className="text-primary hover:underline" href={project.github_url} target="_blank">
            GitHub
          </Link>
        ) : null}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">Updated {formatDate(project.updated_at)}</p>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": project.schema_type || "CreativeWork",
          name: project.title,
          description: project.meta_description || project.short_description,
          image: project.og_image_url || project.featured_image_url,
          dateModified: project.updated_at,
          url: `${getSiteUrl()}/portfolio/${project.slug}`,
        }}
      />
    </section>
  );
}
