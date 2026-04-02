export type Role = "admin" | "editor" | "author";
export type ContentStatus = "draft" | "published";
export type MediaType = "image" | "video";

export type SeoEntity = {
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  schema_type: string | null;
  robots: string | null;
  seo_score: number | null;
};

export type Post = SeoEntity & {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  image_alt: string | null;
  category_id: string | null;
  status: ContentStatus;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsPage = SeoEntity & {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image_url: string | null;
  image_alt: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type PortfolioProject = SeoEntity & {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string;
  technologies: string[] | null;
  project_url: string | null;
  github_url: string | null;
  featured_image_url: string | null;
  image_alt: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  site_name: string;
  site_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  default_seo_title: string | null;
  default_meta_description: string | null;
  default_og_image_url: string | null;
  contact_email: string | null;
  phone_number: string | null;
  address: string | null;
  social_links: Record<string, string> | null;
  footer_text: string | null;
  homepage_hero_content: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  created_at: string;
};

export type MediaItem = {
  id: string;
  title: string;
  media_type: MediaType;
  source_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  provider: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
