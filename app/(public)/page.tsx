import Link from "next/link";

import { BlogCard } from "@/components/content/blog-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { getPublicSettings, getPublishedPortfolio, getPublishedPosts } from "@/lib/supabase/queries/public";

export default async function HomePage() {
  const [posts, portfolio, settings] = await Promise.all([
    getPublishedPosts(),
    getPublishedPortfolio(),
    getPublicSettings(),
  ]);

  return (
    <div>
      <section className="theme-hero border-bottom py-5 py-lg-6">
        <div className="container-main">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <p className="text-uppercase small tracking-[0.24em] opacity-75">Custom CMS Website</p>
              <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-6xl">
                {settings?.homepage_hero_content || "Modern portfolio and publishing platform built for speed and SEO."}
              </h1>
              <p className="mt-4 max-w-2xl fs-5 opacity-75">{settings?.site_description}</p>
              <div className="mt-4 d-flex flex-wrap gap-3">
                <Link href="/portfolio" className="btn btn-primary btn-lg px-4">
                  View Portfolio
                </Link>
                <Link href="/blog" className="btn btn-outline-light btn-lg px-4">
                  Read Blog
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="theme-surface theme-card-glow rounded-4 p-4 p-lg-5 text-foreground">
                <p className="mb-2 text-uppercase small tracking-[0.2em] text-primary">Publishing Flow</p>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">Two premium looks. One CMS.</h2>
                <p className="mt-3 text-muted-foreground">
                  Switch between advanced visual systems from the new Appearance panel, then fine-tune fonts and colors
                  without touching code.
                </p>
                <div className="mt-4 row g-3">
                  <div className="col-6">
                    <div className="rounded-4 border p-3">
                      <p className="mb-1 text-sm font-semibold">SEO Ready</p>
                      <p className="mb-0 text-xs text-muted-foreground">Metadata, schema, sitemap, and publishing score.</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="rounded-4 border p-3">
                      <p className="mb-1 text-sm font-semibold">Media URLs</p>
                      <p className="mb-0 text-xs text-muted-foreground">GitHub, Drive, Canva, and YouTube supported.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">Latest Posts</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="container-main pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">Featured Projects</h2>
          <Link href="/portfolio" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.slice(0, 3).map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
