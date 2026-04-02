"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mediaSchema } from "@/lib/validators/content";

function detectProvider(url: string): string {
  const normalized = url.toLowerCase();
  if (normalized.includes("githubusercontent.com") || normalized.includes("raw.githubusercontent.com")) {
    return "GitHub";
  }
  if (normalized.includes("drive.google.com")) {
    return "Google Drive";
  }
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "YouTube";
  }
  if (normalized.includes("canva")) {
    return "Canva";
  }
  return "External";
}

function parseMediaFormData(formData: FormData) {
  const rawProvider = String(formData.get("provider") || "").trim();

  return mediaSchema.parse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") || ""),
    media_type: String(formData.get("media_type") || "image"),
    source_url: String(formData.get("source_url") || ""),
    thumbnail_url: String(formData.get("thumbnail_url") || ""),
    alt_text: String(formData.get("alt_text") || ""),
    provider: rawProvider || detectProvider(String(formData.get("source_url") || "")),
    notes: String(formData.get("notes") || ""),
  });
}

function revalidateMediaPaths(cmsBasePath: string) {
  revalidatePath(`${cmsBasePath}/media`);
  revalidatePath("/cms-internal/media");
}

export async function createMediaAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parseMediaFormData(formData);

  const { data, error } = await supabase.from("media_items").insert(parsed).select("id").single();
  if (error || !data) {
    throw new Error("Failed to save media item.");
  }

  await logAuditEvent({
    userId: user.id,
    actionType: "media_created",
    entityType: "media",
    entityId: data.id,
    details: { title: parsed.title, media_type: parsed.media_type, provider: parsed.provider },
  });

  revalidateMediaPaths(cmsBasePath);
  redirect(`${cmsBasePath}/media`);
}

export async function deleteMediaAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) {
    throw new Error("Missing media id.");
  }

  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) {
    throw new Error("Failed to delete media item.");
  }

  await logAuditEvent({
    userId: user.id,
    actionType: "media_deleted",
    entityType: "media",
    entityId: id,
  });

  revalidateMediaPaths(cmsBasePath);
  redirect(`${cmsBasePath}/media`);
}
