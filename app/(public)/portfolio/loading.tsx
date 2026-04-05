import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioCardSkeletonGrid } from "@/components/content/portfolio-card-skeleton";

export default function PortfolioLoading() {
  return (
    <div className="container-main py-12">
      {/* Header Skeleton */}
      <div className="mb-12 text-center space-y-4">
        <Skeleton className="h-10 w-56 mx-auto" />
        <Skeleton className="h-5 w-[500px] mx-auto" />
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="mb-8 flex justify-center gap-2 flex-wrap">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Portfolio Grid Skeleton */}
      <PortfolioCardSkeletonGrid count={6} />
    </div>
  );
}
