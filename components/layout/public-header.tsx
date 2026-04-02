import Link from "next/link";

import { getPublicSettings } from "@/lib/supabase/queries/public";

export async function PublicHeader() {
  const settings = await getPublicSettings();

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b bg-card">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {settings?.site_name ?? "Custom CMS"}
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
