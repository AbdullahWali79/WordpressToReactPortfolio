"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Briefcase,
  Image,
  Palette,
  Tags,
  FolderTree,
  Settings,
  Search,
  History,
  ChevronRight,
  ChevronDown,
  Globe,
  Shield,
  BarChart3,
  Megaphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getCmsBasePath } from "@/lib/env";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  submenu?: { href: string; label: string }[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Main",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        href: "/posts",
        label: "Posts",
        icon: FileText,
        submenu: [
          { href: "/posts", label: "All Posts" },
          { href: "/posts/new", label: "Add New" },
          { href: "/categories", label: "Categories" },
          { href: "/tags", label: "Tags" },
        ],
      },
      {
        href: "/pages",
        label: "Pages",
        icon: Layers,
        submenu: [
          { href: "/pages", label: "All Pages" },
          { href: "/pages/new", label: "Add New" },
        ],
      },
      {
        href: "/portfolio",
        label: "Portfolio",
        icon: Briefcase,
        submenu: [
          { href: "/portfolio", label: "All Projects" },
          { href: "/portfolio/new", label: "Add New" },
        ],
      },
    ],
  },
  {
    title: "Media & Appearance",
    items: [
      {
        href: "/media",
        label: "Media Library",
        icon: Image,
      },
      {
        href: "/appearance",
        label: "Appearance",
        icon: Palette,
      },
    ],
  },
  {
    title: "SEO & Marketing",
    items: [
      {
        href: "/seo",
        label: "SEO Panel",
        icon: Search,
        badge: 3,
      },
      {
        href: "/audit-logs",
        label: "Audit Logs",
        icon: History,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        href: "/settings",
        label: "General Settings",
        icon: Settings,
      },
    ],
  },
];

function MenuItemComponent({
  item,
  basePath,
  pathname,
}: {
  item: MenuItem;
  basePath: string;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(() => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) => pathname === `${basePath}${sub.href}`);
  });

  const fullHref = `${basePath}${item.href}`;
  const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const Icon = item.icon;

  return (
    <div className="mb-1">
      <Link
        href={fullHref}
        onClick={(e) => {
          if (hasSubmenu) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white">
            {item.badge}
          </span>
        ) : null}
        {hasSubmenu ? (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        ) : null}
      </Link>

      {/* Submenu */}
      {hasSubmenu && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
          )}
        >
          <div className="ml-4 border-l-2 border-border pl-4 space-y-1">
            {item.submenu!.map((sub) => {
              const subFullHref = `${basePath}${sub.href}`;
              const isSubActive = pathname === subFullHref;
              return (
                <Link
                  key={sub.href}
                  href={subFullHref}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isSubActive
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CmsSidebar() {
  const base = getCmsBasePath();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card flex flex-col">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href={`${base}/dashboard`}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <span>CMS Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {menuGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? "mt-6" : ""}>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MenuItemComponent
                  key={item.href}
                  item={item}
                  basePath={base}
                  pathname={pathname}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>View Website</span>
        </Link>
      </div>
    </aside>
  );
}
