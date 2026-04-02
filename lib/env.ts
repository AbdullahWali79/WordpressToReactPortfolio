const DEFAULT_CMS_PATH = "/secure-control-panel";

export function getCmsBasePath(): string {
  const raw = process.env.CMS_BASE_PATH || DEFAULT_CMS_PATH;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return path.replace(/\/+$/, "") || DEFAULT_CMS_PATH;
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
