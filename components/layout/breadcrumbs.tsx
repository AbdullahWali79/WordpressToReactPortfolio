"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on homepage
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    
    // Format segment: remove hyphens, capitalize words
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check if it's a slug/ID (long alphanumeric or numeric)
    const isId = /^[\w-]{15,}$/.test(segment) || /^\d+$/.test(segment);
    
    // Skip ID segments
    if (isId) return null;

    return {
      href,
      label,
      isLast,
    };
  }).filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "py-4 border-b bg-muted/30",
        className
      )}
    >
      <div className="container-main">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb!.href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              {crumb!.isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb!.label}
                </span>
              ) : (
                <Link
                  href={crumb!.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb!.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
