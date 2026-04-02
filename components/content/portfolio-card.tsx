import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type PortfolioCardProps = {
  project: {
    slug: string;
    title: string;
    short_description: string | null;
    featured_image_url: string | null;
    image_alt: string | null;
    updated_at: string;
  };
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden">
      {project.featured_image_url ? (
        <img
          src={project.featured_image_url}
          alt={project.image_alt || project.title}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">
          <Link href={`/portfolio/${project.slug}`} className="hover:text-primary">
            {project.title}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground">Updated {formatDate(project.updated_at)}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{project.short_description}</p>
      </CardContent>
    </Card>
  );
}
