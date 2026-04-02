"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { getCmsBasePath } from "@/lib/env";
import { enforceLoginRateLimit } from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const cmsPath = getCmsBasePath();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const headerStore = await headers();
  const ipAddress = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const throttle = enforceLoginRateLimit(ipAddress);

  if (!throttle.ok) {
    redirect(`${cmsPath}/login?error=try_again_later`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`${cmsPath}/login?error=invalid_credentials`);
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect(`${cmsPath}/login?error=invalid_credentials`);
  }

  await logAuditEvent({
    userId: data.user.id,
    actionType: "login_success",
    entityType: "auth",
    entityId: data.user.id,
  });

  redirect(`${cmsPath}/dashboard`);
}

export async function logoutAction() {
  const cmsPath = getCmsBasePath();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await logAuditEvent({
      userId: user.id,
      actionType: "logout",
      entityType: "auth",
      entityId: user.id,
    });
  }

  await supabase.auth.signOut();
  redirect(`${cmsPath}/login`);
}
