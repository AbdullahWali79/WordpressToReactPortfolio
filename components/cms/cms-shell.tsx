"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Bell,
  User,
  ChevronRight,
  Search,
  Moon,
  Sun,
  Home,
} from "lucide-react";

import { logoutAction } from "@/lib/cms/actions/auth-actions";
import { CmsSidebar } from "@/components/cms/cms-sidebar";
import { Button } from "@/components/ui/button";
import { getCmsBasePath } from "@/lib/env";
import { cn } from "@/lib/utils";

function Breadcrumbs() {
  const pathname = usePathname();
  const base = getCmsBasePath();

  // Remove base path and split
  const relativePath = pathname.replace(base, "");
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </div>
    );
  }

  const formatLabel = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href={`${base}/dashboard`}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `${base}/${segments.slice(0, index + 1).join("/")}`;
        const isId = /^[\w-]{20,}$/.test(segment) || /^\d+$/.test(segment);

        // Skip ID segments in display
        if (isId) return null;

        return (
          <div key={segment} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">{formatLabel(segment)}</span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {formatLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function CmsShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <CmsSidebar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur px-6">
          {/* Left: Breadcrumbs */}
          <Breadcrumbs />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{userEmail?.split("@")[0] || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>

              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-card px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Custom CMS v1.0</p>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="hover:text-foreground transition-colors">
                View Website
              </Link>
              <span>•</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
