import type { MetadataRoute } from "next";

import { getCmsBasePath, getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const cmsBasePath = getCmsBasePath();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [cmsBasePath, `${cmsBasePath}/`, "/cms-internal", "/cms-internal/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
