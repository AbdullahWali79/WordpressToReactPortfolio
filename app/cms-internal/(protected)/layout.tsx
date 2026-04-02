import { CmsShell } from "@/components/cms/cms-shell";
import { requireAdminUser } from "@/lib/cms/auth";

export default async function CmsProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();
  return <CmsShell userEmail={user.email}>{children}</CmsShell>;
}
