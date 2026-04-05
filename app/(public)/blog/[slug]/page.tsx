import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { ContentRenderer } from "@/components/content/content-renderer";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/content/blog-card";
import { SocialShare } from "@/components/content/social-share";
import { AuthorBox } from "@/components/content/author-box";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/env";
import {
  getPublicSettings,
  getPublishedPostBySlug,
  getRelatedPosts,
} from "@/lib/supabase/queries/public";
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

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.category_id, 3);

  const postUrl = `${getSiteUrl()}/blog/${post.slug}`;

  return (
    <article>
      {/* Header Section */}
      <section className="container-main py-12 lg:py-16">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.category && (
                <Link href={`/category/${post.category.slug}`}>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                {formatDate(post.published_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {(post.tags || []).map((tag: { id: string; name: string; slug: string }) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="secondary">#{tag.name}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Featured Image */}
        {post.featured_image_url && (
          <ScrollReveal delay={0.1}>
            <div className="mt-8 max-w-4xl mx-auto">
              <img
                src={post.featured_image_url}
                alt={post.image_alt || post.title}
                className="w-full aspect-video rounded-2xl object-cover"
              />
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Content Section */}
      <section className="container-main pb-16">
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.2}>
              <div className="prose prose-lg max-w-none">
                <ContentRenderer html={post.content} />
              </div>
            </ScrollReveal>

            {/* Social Share */}
            <ScrollReveal delay={0.3}>
              <div className="mt-12 pt-8 border-t">
                <SocialShare
                  url={postUrl}
                  title={post.title}
                  description={post.excerpt || undefined}
                />
              </div>
            </ScrollReveal>

            {/* Author Box */}
            <ScrollReveal delay={0.4}>
              <div className="mt-8">
                <AuthorBox publishedAt={post.published_at} />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Newsletter Widget */}
            <ScrollReveal delay={0.2} direction="right">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-lg mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Tags Cloud */}
            {(post.tags || []).length > 0 && (
              <ScrollReveal delay={0.3} direction="right">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag: { id: string; name: string; slug: string }) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge variant="outline" className="hover:bg-primary/10">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </aside>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container-main">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                  Related Posts
                </h2>
                <Link
                  href="/blog"
                  className="text-sm text-primary hover:underline"
                >
                  View all posts
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <ScrollReveal key={relatedPost.id} delay={index * 0.1}>
                  <BlogCard post={relatedPost} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.schema_type || "BlogPosting",
          headline: post.title,
          description: post.meta_description || post.excerpt,
          image: post.og_image_url || post.featured_image_url,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
          mainEntityOfPage: postUrl,
        }}
      />
    </article>
  );
}
