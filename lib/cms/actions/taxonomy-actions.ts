"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { taxonomySchema } from "@/lib/validators/content";

function parseTaxonomyFormData(formData: FormData) {
  return taxonomySchema.parse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
  });
}

function revalidateTaxonomy(cmsBasePath: string) {
  revalidatePath("/blog");
  revalidatePath("/cms-internal/categories");
  revalidatePath("/cms-internal/tags");
  revalidatePath(`${cmsBasePath}/categories`);
  revalidatePath(`${cmsBasePath}/tags`);
}

export async function createCategoryAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parseTaxonomyFormData(formData);

  const { data, error } = await supabase.from("categories").insert(parsed).select("id").single();
  if (error || !data) throw new Error("Failed to create category.");

  await logAuditEvent({
    userId: user.id,
    actionType: "category_created",
    entityType: "category",
    entityId: data.id,
    details: { name: parsed.name, slug: parsed.slug },
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/categories`);
}

export async function updateCategoryAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parseTaxonomyFormData(formData);
  if (!parsed.id) throw new Error("Missing category id.");

  const { error } = await supabase.from("categories").update(parsed).eq("id", parsed.id);
  if (error) throw new Error("Failed to update category.");

  await logAuditEvent({
    userId: user.id,
    actionType: "category_updated",
    entityType: "category",
    entityId: parsed.id,
    details: { name: parsed.name, slug: parsed.slug },
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/categories`);
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing category id.");

  await supabase.from("posts").update({ category_id: null }).eq("category_id", id);
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error("Failed to delete category.");

  await logAuditEvent({
    userId: user.id,
    actionType: "category_deleted",
    entityType: "category",
    entityId: id,
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/categories`);
}

export async function createTagAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parseTaxonomyFormData(formData);

  const { data, error } = await supabase.from("tags").insert(parsed).select("id").single();
  if (error || !data) throw new Error("Failed to create tag.");

  await logAuditEvent({
    userId: user.id,
    actionType: "tag_created",
    entityType: "tag",
    entityId: data.id,
    details: { name: parsed.name, slug: parsed.slug },
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/tags`);
}

export async function updateTagAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parseTaxonomyFormData(formData);
  if (!parsed.id) throw new Error("Missing tag id.");

  const { error } = await supabase.from("tags").update(parsed).eq("id", parsed.id);
  if (error) throw new Error("Failed to update tag.");

  await logAuditEvent({
    userId: user.id,
    actionType: "tag_updated",
    entityType: "tag",
    entityId: parsed.id,
    details: { name: parsed.name, slug: parsed.slug },
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/tags`);
}

export async function deleteTagAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing tag id.");

  await supabase.from("post_tags").delete().eq("tag_id", id);
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw new Error("Failed to delete tag.");

  await logAuditEvent({
    userId: user.id,
    actionType: "tag_deleted",
    entityType: "tag",
    entityId: id,
  });

  revalidateTaxonomy(cmsBasePath);
  redirect(`${cmsBasePath}/tags`);
}
