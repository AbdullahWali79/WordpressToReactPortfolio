export type SeoCheck = {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
  recommendation: string;
};

export type SeoScoreResult = {
  score: number;
  status: "good" | "average" | "poor";
  checks: SeoCheck[];
  warnings: string[];
};

export type ScoreInput = {
  title: string;
  slug: string;
  contentHtml: string;
  metaDescription?: string | null;
  seoTitle?: string | null;
  focusKeyword?: string | null;
  imageAlt?: string | null;
  canonicalUrl?: string | null;
};

function includesInsensitive(source: string, target: string): boolean {
  return source.toLowerCase().includes(target.toLowerCase());
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match?.[1]) return "";
  return stripHtml(match[1]);
}

function hasHeading(html: string): boolean {
  return /<h[23][^>]*>/i.test(html);
}

function hasInternalLink(html: string): boolean {
  const links = html.match(/href=["']([^"']+)["']/gi) ?? [];
  return links.some((entry) => {
    const url = entry.toLowerCase();
    return url.includes("href=\"/") || url.includes("href='/");
  });
}

function hasExternalLink(html: string): boolean {
  const links = html.match(/href=["']([^"']+)["']/gi) ?? [];
  return links.some((entry) => /https?:\/\//i.test(entry));
}

function keywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0;
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const keywordWords = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const phrase = keywordWords.join(" ");
  const joined = words.join(" ");
  const occurrences = joined.split(phrase).length - 1;
  return (occurrences / words.length) * 100;
}

export function calculateSeoScore(input: ScoreInput): SeoScoreResult {
  const focusKeyword = (input.focusKeyword ?? "").trim().toLowerCase();
  const textContent = stripHtml(input.contentHtml);
  const firstPara = firstParagraph(input.contentHtml);
  const urlLength = input.slug.length;
  const seoTitle = (input.seoTitle || input.title || "").trim();
  const meta = (input.metaDescription || "").trim();
  const density = keywordDensity(textContent, focusKeyword);

  const checks: SeoCheck[] = [
    {
      id: "keyword-title",
      label: "Focus keyword in title",
      passed: focusKeyword ? includesInsensitive(input.title, focusKeyword) : false,
      weight: 15,
      recommendation: "Include the focus keyword naturally in the title.",
    },
    {
      id: "keyword-slug",
      label: "Focus keyword in slug",
      passed: focusKeyword ? includesInsensitive(input.slug, focusKeyword.replace(/\s+/g, "-")) : false,
      weight: 10,
      recommendation: "Use the focus keyword in the URL slug.",
    },
    {
      id: "keyword-meta",
      label: "Focus keyword in meta description",
      passed: focusKeyword ? includesInsensitive(meta, focusKeyword) : false,
      weight: 15,
      recommendation: "Add the focus keyword to the meta description.",
    },
    {
      id: "keyword-first-paragraph",
      label: "Focus keyword in first paragraph",
      passed: focusKeyword ? includesInsensitive(firstPara, focusKeyword) : false,
      weight: 15,
      recommendation: "Mention the focus keyword in the first paragraph.",
    },
    {
      id: "content-length",
      label: "Content length >= 300 words",
      passed: textContent.split(/\s+/).filter(Boolean).length >= 300,
      weight: 10,
      recommendation: "Expand content to at least 300 words for stronger topical coverage.",
    },
    {
      id: "heading-structure",
      label: "Contains H2 or H3 heading",
      passed: hasHeading(input.contentHtml),
      weight: 5,
      recommendation: "Add at least one H2 or H3 heading for structure.",
    },
    {
      id: "internal-link",
      label: "Contains internal link",
      passed: hasInternalLink(input.contentHtml),
      weight: 10,
      recommendation: "Add at least one internal link to related content.",
    },
    {
      id: "image-alt",
      label: "Image alt text provided",
      passed: Boolean((input.imageAlt || "").trim()),
      weight: 10,
      recommendation: "Add descriptive image alt text.",
    },
    {
      id: "seo-title-length",
      label: "SEO title length between 30-60 chars",
      passed: seoTitle.length >= 30 && seoTitle.length <= 60,
      weight: 5,
      recommendation: "Keep SEO title between 30 and 60 characters.",
    },
    {
      id: "meta-description-length",
      label: "Meta description length between 120-160 chars",
      passed: meta.length >= 120 && meta.length <= 160,
      weight: 5,
      recommendation: "Keep meta description between 120 and 160 characters.",
    },
  ];

  const baseScore = checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0);
  const warnings: string[] = [];

  if (urlLength > 75) warnings.push("URL slug is long. Keep it concise and readable.");
  if (!hasExternalLink(input.contentHtml))
    warnings.push("Consider adding a trusted external reference link.");
  if (focusKeyword && (density < 0.5 || density > 2.5))
    warnings.push("Keyword density is outside the recommended 0.5% - 2.5% range.");
  if (textContent.split(/[.!?]/).length < 5)
    warnings.push("Readability can improve with shorter sentences and clearer sections.");
  if (!input.canonicalUrl) warnings.push("Add a canonical URL to prevent duplicate content issues.");

  const score = Math.max(0, Math.min(100, baseScore));
  const status: SeoScoreResult["status"] = score >= 80 ? "good" : score >= 60 ? "average" : "poor";

  return { score, status, checks, warnings };
}
