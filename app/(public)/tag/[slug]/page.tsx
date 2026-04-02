import { notFound } from "next/navigation";

import { BlogCard } from "@/components/content/blog-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/supabase/queries/public";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: tag } = await supabase.from("tags").select("name,slug").eq("slug", slug).maybeSingle();
  if (!tag) notFound();

  const posts = await getPublishedPosts({ tagSlug: slug });

  return (
    <section className="container-main py-16">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Tag: {tag.name}</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
