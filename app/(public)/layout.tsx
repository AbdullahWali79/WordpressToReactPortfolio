import { PublicThemeShell } from "@/components/layout/public-theme-shell";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicThemeShell>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </PublicThemeShell>
  );
}
