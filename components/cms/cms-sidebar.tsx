import Link from "next/link";

import { getCmsBasePath } from "@/lib/env";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/pages", label: "Pages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/media", label: "Media" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
  { href: "/settings", label: "Settings" },
  { href: "/seo", label: "SEO" },
  { href: "/audit-logs", label: "Audit Logs" },
];

export function CmsSidebar() {
  const base = getCmsBasePath();
  return (
    <aside className="w-64 border-r bg-card p-4">
      <p className="mb-6 font-semibold tracking-tight">CMS</p>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={`${base}${item.href}`}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
