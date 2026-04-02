"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { calculateSeoScore } from "@/lib/seo/score";
import { sanitizeRichText } from "@/lib/security/sanitize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pageSchema } from "@/lib/validators/content";

function parsePageFormData(formData: FormData) {
  const raw = {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    content: sanitizeRichText(String(formData.get("content") || "")),
    featured_image_url: String(formData.get("featured_image_url") || ""),
    image_alt: String(formData.get("image_alt") || ""),
    status: String(formData.get("status") || "draft"),
    seo_title: String(formData.get("seo_title") || ""),
    meta_description: String(formData.get("meta_description") || ""),
    focus_keyword: String(formData.get("focus_keyword") || ""),
    canonical_url: String(formData.get("canonical_url") || ""),
    og_title: String(formData.get("og_title") || ""),
    og_description: String(formData.get("og_description") || ""),
    og_image_url: String(formData.get("og_image_url") || ""),
    schema_type: String(formData.get("schema_type") || ""),
    robots: String(formData.get("robots") || "index,follow"),
  };
  return pageSchema.parse(raw);
}

function revalidatePagePaths(cmsBasePath: string) {
  revalidatePath("/sitemap.xml");
  revalidatePath("/cms-internal/pages");
  revalidatePath(`${cmsBasePath}/pages`);
}

export async function createCmsPageAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePageFormData(formData);
  const seo = calculateSeoScore({
    title: parsed.title,
    slug: parsed.slug,
    contentHtml: parsed.content,
    metaDescription: parsed.meta_description ?? "",
    seoTitle: parsed.seo_title ?? "",
    focusKeyword: parsed.focus_keyword ?? "",
    imageAlt: parsed.image_alt ?? "",
    canonicalUrl: parsed.canonical_url ?? "",
  });

  const { data, error } = await supabase
    .from("pages")
    .insert({
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      featured_image_url: parsed.featured_image_url,
      image_alt: parsed.image_alt,
      status: parsed.status,
      seo_title: parsed.seo_title,
      meta_description: parsed.meta_description,
      focus_keyword: parsed.focus_keyword,
      canonical_url: parsed.canonical_url,
      og_title: parsed.og_title,
      og_description: parsed.og_description,
      og_image_url: parsed.og_image_url,
      schema_type: parsed.schema_type || "WebPage",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create page.");

  await logAuditEvent({
    userId: user.id,
    actionType: "page_created",
    entityType: "page",
    entityId: data.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePagePaths(cmsBasePath);
  redirect(`${cmsBasePath}/pages`);
}

export async function updateCmsPageAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePageFormData(formData);
  if (!parsed.id) throw new Error("Missing page id.");

  const seo = calculateSeoScore({
    title: parsed.title,
    slug: parsed.slug,
    contentHtml: parsed.content,
    metaDescription: parsed.meta_description ?? "",
    seoTitle: parsed.seo_title ?? "",
    focusKeyword: parsed.focus_keyword ?? "",
    imageAlt: parsed.image_alt ?? "",
    canonicalUrl: parsed.canonical_url ?? "",
  });

  const { error } = await supabase
    .from("pages")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      featured_image_url: parsed.featured_image_url,
      image_alt: parsed.image_alt,
      status: parsed.status,
      seo_title: parsed.seo_title,
      meta_description: parsed.meta_description,
      focus_keyword: parsed.focus_keyword,
      canonical_url: parsed.canonical_url,
      og_title: parsed.og_title,
      og_description: parsed.og_description,
      og_image_url: parsed.og_image_url,
      schema_type: parsed.schema_type || "WebPage",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .eq("id", parsed.id);

  if (error) throw new Error("Failed to update page.");

  await logAuditEvent({
    userId: user.id,
    actionType: "page_updated",
    entityType: "page",
    entityId: parsed.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePagePaths(cmsBasePath);
  redirect(`${cmsBasePath}/pages`);
}

export async function deleteCmsPageAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing page id.");

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error("Failed to delete page.");

  await logAuditEvent({
    userId: user.id,
    actionType: "page_deleted",
    entityType: "page",
    entityId: id,
  });

  revalidatePagePaths(cmsBasePath);
  redirect(`${cmsBasePath}/pages`);
}
