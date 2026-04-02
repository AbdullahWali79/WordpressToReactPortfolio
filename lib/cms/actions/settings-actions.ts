"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validators/content";

export async function updateSettingsAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = settingsSchema.parse({
    site_name: String(formData.get("site_name") || ""),
    site_description: String(formData.get("site_description") || ""),
    logo_url: String(formData.get("logo_url") || ""),
    favicon_url: String(formData.get("favicon_url") || ""),
    default_seo_title: String(formData.get("default_seo_title") || ""),
    default_meta_description: String(formData.get("default_meta_description") || ""),
    default_og_image_url: String(formData.get("default_og_image_url") || ""),
    contact_email: String(formData.get("contact_email") || ""),
    phone_number: String(formData.get("phone_number") || ""),
    address: String(formData.get("address") || ""),
    social_links: String(formData.get("social_links") || "{}"),
    footer_text: String(formData.get("footer_text") || ""),
    homepage_hero_content: String(formData.get("homepage_hero_content") || ""),
  });

  const { data: existing } = await supabase.from("settings").select("id").limit(1).maybeSingle();

  const mutation = existing
    ? supabase.from("settings").update(parsed).eq("id", existing.id)
    : supabase.from("settings").insert(parsed);

  const { error } = await mutation;
  if (error) throw new Error("Failed to update settings.");

  await logAuditEvent({
    userId: user.id,
    actionType: "settings_updated",
    entityType: "settings",
    entityId: existing?.id ?? null,
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/blog");
  revalidatePath("/portfolio");
  revalidatePath("/cms-internal/settings");
  revalidatePath(`${cmsBasePath}/settings`);
  redirect(`${cmsBasePath}/settings`);
}
