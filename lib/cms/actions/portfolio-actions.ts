"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { calculateSeoScore } from "@/lib/seo/score";
import { sanitizeRichText } from "@/lib/security/sanitize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { portfolioSchema } from "@/lib/validators/content";

function parsePortfolioFormData(formData: FormData) {
  const raw = {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    short_description: String(formData.get("short_description") || ""),
    full_description: sanitizeRichText(String(formData.get("full_description") || "")),
    technologies: String(formData.get("technologies") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    project_url: String(formData.get("project_url") || ""),
    github_url: String(formData.get("github_url") || ""),
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
  return portfolioSchema.parse(raw);
}

function revalidatePortfolioPaths(cmsBasePath: string) {
  revalidatePath("/portfolio");
  revalidatePath("/sitemap.xml");
  revalidatePath("/cms-internal/portfolio");
  revalidatePath(`${cmsBasePath}/portfolio`);
}

export async function createPortfolioAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePortfolioFormData(formData);
  const seo = calculateSeoScore({
    title: parsed.title,
    slug: parsed.slug,
    contentHtml: parsed.full_description,
    metaDescription: parsed.meta_description ?? "",
    seoTitle: parsed.seo_title ?? "",
    focusKeyword: parsed.focus_keyword ?? "",
    imageAlt: parsed.image_alt ?? "",
    canonicalUrl: parsed.canonical_url ?? "",
  });

  const { data, error } = await supabase
    .from("portfolio_projects")
    .insert({
      title: parsed.title,
      slug: parsed.slug,
      short_description: parsed.short_description,
      full_description: parsed.full_description,
      technologies: parsed.technologies,
      project_url: parsed.project_url,
      github_url: parsed.github_url,
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
      schema_type: parsed.schema_type || "CreativeWork",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create project.");

  await logAuditEvent({
    userId: user.id,
    actionType: "portfolio_created",
    entityType: "portfolio",
    entityId: data.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePortfolioPaths(cmsBasePath);
  redirect(`${cmsBasePath}/portfolio`);
}

export async function updatePortfolioAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePortfolioFormData(formData);
  if (!parsed.id) throw new Error("Missing project id.");

  const seo = calculateSeoScore({
    title: parsed.title,
    slug: parsed.slug,
    contentHtml: parsed.full_description,
    metaDescription: parsed.meta_description ?? "",
    seoTitle: parsed.seo_title ?? "",
    focusKeyword: parsed.focus_keyword ?? "",
    imageAlt: parsed.image_alt ?? "",
    canonicalUrl: parsed.canonical_url ?? "",
  });

  const { error } = await supabase
    .from("portfolio_projects")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      short_description: parsed.short_description,
      full_description: parsed.full_description,
      technologies: parsed.technologies,
      project_url: parsed.project_url,
      github_url: parsed.github_url,
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
      schema_type: parsed.schema_type || "CreativeWork",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .eq("id", parsed.id);

  if (error) throw new Error("Failed to update project.");

  await logAuditEvent({
    userId: user.id,
    actionType: "portfolio_updated",
    entityType: "portfolio",
    entityId: parsed.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePortfolioPaths(cmsBasePath);
  redirect(`${cmsBasePath}/portfolio`);
}

export async function deletePortfolioAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing project id.");

  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
  if (error) throw new Error("Failed to delete project.");

  await logAuditEvent({
    userId: user.id,
    actionType: "portfolio_deleted",
    entityType: "portfolio",
    entityId: id,
  });

  revalidatePortfolioPaths(cmsBasePath);
  redirect(`${cmsBasePath}/portfolio`);
}
