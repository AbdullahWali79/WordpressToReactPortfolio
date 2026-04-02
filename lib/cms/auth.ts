import { redirect } from "next/navigation";

import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  const supabase = await createSupabaseServerClient();
  const cmsPath = getCmsBasePath();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect(`${cmsPath}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect(`${cmsPath}/login?error=unauthorized`);
  }

  return data.user;
}
