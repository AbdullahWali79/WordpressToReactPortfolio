import Link from "next/link";

import { BlogCard } from "@/components/content/blog-card";
import { PortfolioCard } from "@/components/content/portfolio-card";
import { Button } from "@/components/ui/button";
import { getPublicSettings, getPublishedPortfolio, getPublishedPosts } from "@/lib/supabase/queries/public";

export default async function HomePage() {
  const [posts, portfolio, settings] = await Promise.all([
    getPublishedPosts(),
    getPublishedPortfolio(),
    getPublicSettings(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-cyan-900 to-cyan-700 py-24 text-white">
        <div className="container-main">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Custom CMS Website</p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-6xl">
            {settings?.homepage_hero_content || "Modern portfolio and publishing platform built for speed and SEO."}
          </h1>
          <p className="mt-6 max-w-2xl text-cyan-100">{settings?.site_description}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="bg-white text-cyan-900 hover:bg-cyan-50">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
              <Link href="/blog">Read Blog</Link>
            </Button>
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
