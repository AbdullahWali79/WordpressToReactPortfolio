import { z } from "zod";

import { isValidHttpUrl } from "@/lib/utils";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => isValidHttpUrl(v), "Please enter a valid URL.");

const seoSchema = z.object({
  seo_title: z.string().trim().max(70).optional().transform((v) => v || null),
  meta_description: z.string().trim().max(200).optional().transform((v) => v || null),
  focus_keyword: z.string().trim().max(120).optional().transform((v) => v || null),
  canonical_url: optionalUrl,
  og_title: z.string().trim().max(120).optional().transform((v) => v || null),
  og_description: z.string().trim().max(220).optional().transform((v) => v || null),
  og_image_url: optionalUrl,
  schema_type: z.string().trim().max(80).optional().transform((v) => v || null),
  robots: z.enum(["index,follow", "noindex,nofollow"]).default("index,follow"),
});

export const postSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(3).max(180),
    slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().trim().max(260).optional().transform((v) => v || null),
    content: z.string().trim().min(30),
    featured_image_url: optionalUrl,
    image_alt: z.string().trim().max(180).optional().transform((v) => v || null),
    category_id: z.string().uuid().optional().transform((v) => v || null),
    status: z.enum(["draft", "published"]).default("draft"),
    tag_ids: z.array(z.string().uuid()).default([]),
  })
  .merge(seoSchema);

export const pageSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(3).max(180),
    slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/),
    content: z.string().trim().min(30),
    featured_image_url: optionalUrl,
    image_alt: z.string().trim().max(180).optional().transform((v) => v || null),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .merge(seoSchema);

export const portfolioSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(3).max(180),
    slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/),
    short_description: z.string().trim().max(260).optional().transform((v) => v || null),
    full_description: z.string().trim().min(30),
    technologies: z.array(z.string().trim()).default([]),
    project_url: optionalUrl,
    github_url: optionalUrl,
    featured_image_url: optionalUrl,
    image_alt: z.string().trim().max(180).optional().transform((v) => v || null),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .merge(seoSchema);

export const taxonomySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
});

export const settingsSchema = z.object({
  site_name: z.string().trim().min(2).max(150),
  site_description: z.string().trim().max(220).optional().transform((v) => v || null),
  logo_url: optionalUrl,
  favicon_url: optionalUrl,
  default_seo_title: z.string().trim().max(70).optional().transform((v) => v || null),
  default_meta_description: z.string().trim().max(200).optional().transform((v) => v || null),
  default_og_image_url: optionalUrl,
  contact_email: z.string().trim().email().optional().or(z.literal("")).transform((v) => v || null),
  phone_number: z.string().trim().max(60).optional().transform((v) => v || null),
  address: z.string().trim().max(220).optional().transform((v) => v || null),
  footer_text: z.string().trim().max(220).optional().transform((v) => v || null),
  homepage_hero_content: z.string().trim().max(400).optional().transform((v) => v || null),
  social_links: z
    .string()
    .trim()
    .optional()
    .transform((v) => {
      if (!v) return {};
      try {
        return JSON.parse(v);
      } catch {
        return {};
      }
    }),
});

export const mediaSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  media_type: z.enum(["image", "video"]),
  source_url: z
    .string()
    .trim()
    .min(10)
    .refine((v) => isValidHttpUrl(v), "Please enter a valid media URL."),
  thumbnail_url: optionalUrl,
  alt_text: z.string().trim().max(180).optional().transform((v) => v || null),
  provider: z.string().trim().max(80).optional().transform((v) => v || null),
  notes: z.string().trim().max(400).optional().transform((v) => v || null),
});

export const appearanceSchema = z.object({
  active_theme: z.enum(["editorial-luxe", "studio-carbon"]),
  primary_color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  surface_color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  background_color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  heading_font: z.string().trim().min(3).max(140),
  body_font: z.string().trim().min(3).max(140),
  button_radius: z.string().trim().min(2).max(20),
});
