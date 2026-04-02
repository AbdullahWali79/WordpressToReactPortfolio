import type { Metadata } from "next";

import { PortfolioCard } from "@/components/content/portfolio-card";
import { Input } from "@/components/ui/input";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getPublicSettings, getPublishedPortfolio } from "@/lib/supabase/queries/public";

type PortfolioPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildSeoMetadata({
    title: "Portfolio",
    description: "Case studies and selected projects.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio`,
    settings,
  });
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const projects = await getPublishedPortfolio(query || undefined);

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Portfolio</h1>

      <form className="mt-8 max-w-md">
        <Input name="q" defaultValue={query} placeholder="Search projects..." />
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <PortfolioCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
