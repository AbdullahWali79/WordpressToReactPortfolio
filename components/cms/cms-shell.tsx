import { LogOut } from "lucide-react";

import { logoutAction } from "@/lib/cms/actions/auth-actions";
import { CmsSidebar } from "@/components/cms/cms-sidebar";
import { Button } from "@/components/ui/button";

export function CmsShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string | null }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <CmsSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b bg-card px-6">
            <div>
              <p className="text-sm font-medium">Hidden CMS Panel</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <form action={logoutAction}>
              <Button size="sm" variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
