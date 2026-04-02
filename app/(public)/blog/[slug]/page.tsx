import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ContentRenderer } from "@/components/content/content-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/env";
import { getPublicSettings, getPublishedPostBySlug } from "@/lib/supabase/queries/public";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPublishedPostBySlug(slug), getPublicSettings()]);
  if (!post) return {};

  return buildSeoMetadata({
    title: post.seo_title || post.title,
    description: post.meta_description || post.excerpt,
    canonicalUrl: post.canonical_url || `${getSiteUrl()}/blog/${post.slug}`,
    ogTitle: post.og_title || post.title,
    ogDescription: post.og_description || post.meta_description || post.excerpt,
    ogImageUrl: post.og_image_url || post.featured_image_url,
    robots: post.robots || "index,follow",
    settings,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span>{formatDate(post.published_at)}</span>
        {post.category ? <Badge>{post.category.name}</Badge> : null}
        {(post.tags || []).map((tag: { id: string; name: string; slug: string }) => (
          <Badge key={tag.id}>{tag.name}</Badge>
        ))}
      </div>

      {post.featured_image_url ? (
        <img
          src={post.featured_image_url}
          alt={post.image_alt || post.title}
          className="mt-8 h-[360px] w-full rounded-lg object-cover"
        />
      ) : null}

      <div className="mt-10">
        <ContentRenderer html={post.content} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.schema_type || "BlogPosting",
          headline: post.title,
          description: post.meta_description || post.excerpt,
          image: post.og_image_url || post.featured_image_url,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
          mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
        }}
      />
    </section>
  );
}
