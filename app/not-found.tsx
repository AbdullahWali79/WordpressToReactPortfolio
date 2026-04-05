import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Graphic */}
          <div className="relative mb-8">
            <div className="text-[150px] font-bold leading-none text-primary/10 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-primary">404</div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Read Blog
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/about" className="text-primary hover:underline">
                About Us
              </Link>
              <span className="text-border">•</span>
              <Link href="/services" className="text-primary hover:underline">
                Services
              </Link>
              <span className="text-border">•</span>
              <Link href="/portfolio" className="text-primary hover:underline">
                Portfolio
              </Link>
              <span className="text-border">•</span>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
