"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logAuditEvent } from "@/lib/cms/audit";
import { requireAdminUser } from "@/lib/cms/auth";
import { getCmsBasePath } from "@/lib/env";
import { calculateSeoScore } from "@/lib/seo/score";
import { sanitizeRichText } from "@/lib/security/sanitize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { postSchema } from "@/lib/validators/content";

function parsePostFormData(formData: FormData) {
  const raw = {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    content: sanitizeRichText(String(formData.get("content") || "")),
    featured_image_url: String(formData.get("featured_image_url") || ""),
    image_alt: String(formData.get("image_alt") || ""),
    category_id: String(formData.get("category_id") || ""),
    status: String(formData.get("status") || "draft"),
    tag_ids: formData.getAll("tag_ids").map((value) => String(value)),
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

  return postSchema.parse(raw);
}

function revalidatePostPaths(cmsBasePath: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/cms-internal/posts");
  revalidatePath(`${cmsBasePath}/posts`);
}

export async function createPostAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePostFormData(formData);
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

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      featured_image_url: parsed.featured_image_url,
      image_alt: parsed.image_alt,
      category_id: parsed.category_id,
      status: parsed.status,
      author_id: user.id,
      published_at: parsed.status === "published" ? new Date().toISOString() : null,
      seo_title: parsed.seo_title,
      meta_description: parsed.meta_description,
      focus_keyword: parsed.focus_keyword,
      canonical_url: parsed.canonical_url,
      og_title: parsed.og_title,
      og_description: parsed.og_description,
      og_image_url: parsed.og_image_url,
      schema_type: parsed.schema_type || "BlogPosting",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error("Failed to create post.");
  }

  if (parsed.tag_ids.length) {
    await supabase.from("post_tags").insert(parsed.tag_ids.map((tagId) => ({ post_id: inserted.id, tag_id: tagId })));
  }

  await logAuditEvent({
    userId: user.id,
    actionType: "post_created",
    entityType: "post",
    entityId: inserted.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePostPaths(cmsBasePath);
  redirect(`${cmsBasePath}/posts`);
}

export async function updatePostAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const parsed = parsePostFormData(formData);

  if (!parsed.id) {
    throw new Error("Missing post id.");
  }

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
    .from("posts")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      featured_image_url: parsed.featured_image_url,
      image_alt: parsed.image_alt,
      category_id: parsed.category_id,
      status: parsed.status,
      published_at: parsed.status === "published" ? new Date().toISOString() : null,
      seo_title: parsed.seo_title,
      meta_description: parsed.meta_description,
      focus_keyword: parsed.focus_keyword,
      canonical_url: parsed.canonical_url,
      og_title: parsed.og_title,
      og_description: parsed.og_description,
      og_image_url: parsed.og_image_url,
      schema_type: parsed.schema_type || "BlogPosting",
      robots: parsed.robots,
      seo_score: seo.score,
    })
    .eq("id", parsed.id);

  if (error) {
    throw new Error("Failed to update post.");
  }

  await supabase.from("post_tags").delete().eq("post_id", parsed.id);
  if (parsed.tag_ids.length) {
    await supabase.from("post_tags").insert(parsed.tag_ids.map((tagId) => ({ post_id: parsed.id, tag_id: tagId })));
  }

  await logAuditEvent({
    userId: user.id,
    actionType: "post_updated",
    entityType: "post",
    entityId: parsed.id,
    details: { slug: parsed.slug, status: parsed.status },
  });

  revalidatePostPaths(cmsBasePath);
  redirect(`${cmsBasePath}/posts`);
}

export async function deletePostAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const cmsBasePath = getCmsBasePath();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing post id.");

  await supabase.from("post_tags").delete().eq("post_id", id);
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error("Failed to delete post.");

  await logAuditEvent({
    userId: user.id,
    actionType: "post_deleted",
    entityType: "post",
    entityId: id,
  });

  revalidatePostPaths(cmsBasePath);
  redirect(`${cmsBasePath}/posts`);
}
