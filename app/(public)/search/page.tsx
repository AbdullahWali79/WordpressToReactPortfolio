import Link from "next/link";

import { Input } from "@/components/ui/input";
import { getSearchResults } from "@/lib/supabase/queries/public";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.q?.trim() || "";
  const results = keyword ? await getSearchResults(keyword) : { posts: [], pages: [], portfolio: [] };

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Search</h1>
      <form className="mt-8 max-w-lg">
        <Input name="q" defaultValue={keyword} placeholder="Search blog posts, pages, portfolio..." />
      </form>

      {keyword ? (
        <div className="mt-10 space-y-8">
          <div>
            <h2 className="text-xl font-semibold">Posts ({results.posts.length})</h2>
            <ul className="mt-3 space-y-2">
              {results.posts.map((post) => (
                <li key={post.id}>
                  <Link className="text-primary hover:underline" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Pages ({results.pages.length})</h2>
            <ul className="mt-3 space-y-2">
              {results.pages.map((page) => (
                <li key={page.id}>
                  <Link className="text-primary hover:underline" href={`/page/${page.slug}`}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Portfolio ({results.portfolio.length})</h2>
            <ul className="mt-3 space-y-2">
              {results.portfolio.map((project) => (
                <li key={project.id}>
                  <Link className="text-primary hover:underline" href={`/portfolio/${project.slug}`}>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">Enter a keyword to start searching.</p>
      )}
    </section>
  );
}
