import { PublicThemeShell } from "@/components/layout/public-theme-shell";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { BackToTop } from "@/components/layout/back-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicThemeShell>
      <ReadingProgress />
      <PublicHeader />
      <Breadcrumbs />
      <main>{children}</main>
      <PublicFooter />
      <BackToTop />
    </PublicThemeShell>
  );
}
