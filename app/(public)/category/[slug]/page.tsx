import { notFound } from "next/navigation";

import { BlogCard } from "@/components/content/blog-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/supabase/queries/public";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: category } = await supabase.from("categories").select("name,slug").eq("slug", slug).maybeSingle();
  if (!category) notFound();

  const posts = await getPublishedPosts({ categorySlug: slug });

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Category: {category.name}</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
