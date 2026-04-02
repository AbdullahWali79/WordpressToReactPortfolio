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
    <header className="border-bottom bg-card/90 backdrop-blur">
      <div className="container-main d-flex h-16 align-items-center justify-content-between gap-3">
        <Link href="/" className="font-[family-name:var(--font-heading)] fw-semibold tracking-tight text-decoration-none text-foreground">
          {settings?.site_name ?? "Custom CMS"}
        </Link>
        <nav className="d-none d-md-flex align-items-center gap-4 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-decoration-none text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
