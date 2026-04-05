import { Skeleton } from "@/components/ui/skeleton";
import { BlogCardSkeletonGrid } from "@/components/content/blog-card-skeleton";

export default function BlogLoading() {
  return (
    <div className="container-main py-12">
      {/* Header Skeleton */}
      <div className="mb-12 text-center space-y-4">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Blog Grid Skeleton */}
      <BlogCardSkeletonGrid count={6} />

      {/* Pagination Skeleton */}
      <div className="mt-12 flex justify-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}
