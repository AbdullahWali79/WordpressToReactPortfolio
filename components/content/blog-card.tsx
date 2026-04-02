import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    featured_image_url: string | null;
    image_alt: string | null;
    published_at: string | null;
  };
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      {post.featured_image_url ? (
        <img
          src={post.featured_image_url}
          alt={post.image_alt || post.title}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(post.published_at)}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
